import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {}

  private async sendMail(
    templateIdKey: string,
    params: {
      to_email: string;
      subject: string;
      [key: string]: any;
    },
  ) {
    const serviceId = this.configService.get<string>('EMAILJS_SERVICE_ID');
    const templateId = this.configService.get<string>(templateIdKey);
    const publicKey = this.configService.get<string>('EMAILJS_PUBLIC_KEY');
    const privateKey = this.configService.get<string>('EMAILJS_PRIVATE_KEY');

    if (!params.to_email) {
      this.logger.error(
        `Attempted to send email with empty recipient. Template key: ${templateIdKey}`,
      );
      throw new Error('The recipient address is empty before sending email');
    }

    // Ensure template has multiple common field names for compatibility
    params.email = params.to_email;
    params.recipient_email = params.to_email;

    if (serviceId && templateId && publicKey) {
      try {
        const payload = {
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          accessToken: privateKey,
          template_params: params,
        };

        const response = await axios.post(
          'https://api.emailjs.com/api/v1.0/email/send',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        this.logger.log(
          `Email sent successfully via EmailJS to ${params.to_email} using template ${templateId}`,
        );
        return response.data;
      } catch (error) {
        const errorMessage = error.response?.data || error.message;
        this.logger.warn(
          `EmailJS push failed for ${params.to_email}; trying SMTP fallback: ${JSON.stringify(errorMessage)}`,
        );
      }
    } else {
      this.logger.warn(
        `EmailJS configuration is incomplete. Missing: ${!serviceId ? 'serviceId ' : ''}${!templateId ? 'templateId ' : ''}${!publicKey ? 'publicKey' : ''}. Trying SMTP fallback.`,
      );
    }

    return this.sendViaSmtp(params);
  }

  private async sendViaSmtp(params: {
    to_email: string;
    subject: string;
    [key: string]: any;
  }) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<string>('SMTP_PORT') || 465);
    const secure =
      this.configService.get<string>('SMTP_SECURE', 'true') === 'true';
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASSWORD');
    const from = this.configService.get<string>('MAIL_FROM') || user;

    if (!host || !user || !pass || !from) {
      throw new Error('SMTP configuration is incomplete in .env');
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    const text = this.buildPlainTextEmail(params);
    const html = text.replace(/\n/g, '<br />');

    await transporter.sendMail({
      from,
      to: params.to_email,
      subject: params.subject,
      text,
      html,
    });

    this.logger.log(`Email sent successfully via SMTP to ${params.to_email}`);
  }

  private buildPlainTextEmail(params: Record<string, any>) {
    if (params.verification_code) {
      return `Your SIMS login verification code is: ${params.verification_code}\n\nThis code expires in 5 minutes.`;
    }

    if (params.invite_url) {
      return `You have been invited to SIMS.\n\nActivate your account here:\n${params.invite_url}`;
    }

    return params.message || params.subject || 'SIMS notification';
  }

  async sendInviteEmail(to: string, token: string) {
    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:5173',
    );
    const inviteUrl = `${frontendUrl}/confirm-account?token=${token}`;

    await this.sendMail('EMAILJS_INVITE_TEMPLATE_ID', {
      to_email: to,
      subject: 'Account Invitation - SIMS',
      invite_url: inviteUrl,
    });
  }

  async sendOtpEmail(to: string, code: string) {
    await this.sendMail('EMAILJS_OTP_TEMPLATE_ID', {
      to_email: to,
      subject: 'Your Login Verification Code',
      verification_code: code,
    });
  }
}
