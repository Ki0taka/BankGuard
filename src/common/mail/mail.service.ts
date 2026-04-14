import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {}

  private async sendMail(templateIdKey: string, params: {
    to_email: string;
    subject: string;
    [key: string]: any;
  }) {
    const serviceId = this.configService.get<string>('EMAILJS_SERVICE_ID');
    const templateId = this.configService.get<string>(templateIdKey);
    const publicKey = this.configService.get<string>('EMAILJS_PUBLIC_KEY');
    const privateKey = this.configService.get<string>('EMAILJS_PRIVATE_KEY');

    if (!serviceId || !templateId || !publicKey) {
      this.logger.error(`EmailJS configuration is incomplete in .env. Missing: ${!serviceId ? 'serviceId ' : ''}${!templateId ? 'templateId ' : ''}${!publicKey ? 'publicKey' : ''}`);
      return;
    }

    if (!params.to_email) {
      this.logger.error(`Attempted to send email with empty recipient. Template key: ${templateIdKey}`);
      throw new Error('The recipients address is empty before sending to EmailJS');
    }

    // Ensure template has multiple common field names for compatibility
    params.email = params.to_email;
    params.recipient_email = params.to_email;

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

      this.logger.log(`Email sent successfully via EmailJS to ${params.to_email} using template ${templateId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data || error.message;
      this.logger.error(`EmailJS push failed for ${params.to_email}: ${JSON.stringify(errorMessage)}`);
      throw new Error(`Failed to send email via EmailJS: ${JSON.stringify(errorMessage)}`);
    }
  }


  async sendInviteEmail(to: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
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
