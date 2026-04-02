import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SMTPClient } from 'emailjs';

@Injectable()
export class MailService {
  private client: SMTPClient;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.client = new SMTPClient({
      user: this.configService.get<string>('SMTP_USER'),
      password:
        this.configService.get<string>('SMTP_PASSWORD') ||
        this.configService.get<string>('SMTP_PASS'),
      host: this.configService.get<string>('SMTP_HOST'),
      port: Number(this.configService.get<number>('SMTP_PORT', 2525)),
      ssl: String(this.configService.get('SMTP_SECURE')) === 'true',
    });
  }

  private getFromAddress() {
    return (
      this.configService.get<string>('MAIL_FROM') ||
      this.configService.get<string>('SMTP_FROM')
    );
  }

  private assertSmtpConfig() {
    const requiredValues = {
      SMTP_HOST: this.configService.get<string>('SMTP_HOST'),
      SMTP_PORT: this.configService.get<string>('SMTP_PORT'),
      SMTP_USER: this.configService.get<string>('SMTP_USER'),
      SMTP_PASSWORD:
        this.configService.get<string>('SMTP_PASSWORD') ||
        this.configService.get<string>('SMTP_PASS'),
      MAIL_FROM: this.getFromAddress(),
    };

    const missingKeys = Object.entries(requiredValues)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missingKeys.length) {
      const message = `SMTP configuration is incomplete: ${missingKeys.join(', ')}`;
      this.logger.error(message);
      throw new Error(message);
    }
  }

  private async sendMail(options: { to: string, subject: string, html: string, from?: string }) {
    this.assertSmtpConfig();

    return new Promise((resolve, reject) => {
      this.client.send(
        {
          text: options.html.replace(/<[^>]*>?/gm, ''), // Basic text fallback
          from: options.from || this.getFromAddress(),
          to: options.to,
          subject: options.subject,
          attachment: [
            { data: options.html, alternative: true }
          ]
        },
        (err, message) => {
          if (err) {
            this.logger.error(`EmailJS Error: ${err.message}`);
            return reject(err);
          }
          this.logger.log(`Email sent successfully to ${options.to}`);
          resolve(message);
        }
      );
    });
  }

  async sendInviteEmail(to: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
    const inviteUrl = `${frontendUrl}/confirm-account?token=${token}`;

    await this.sendMail({
      to,
      subject: 'Account Invitation - SIMS',
      html: `
        <h1>Welcome to SIMS</h1>
        <p>You have been invited to join the Sanctions Intelligence Management System.</p>
        <p>Please click the link below to confirm your account and log in:</p>
        <a href="${inviteUrl}">${inviteUrl}</a>
        <p>If you did not expect this invitation, please ignore this email.</p>
      `,
    });
  }

  async sendOtpEmail(to: string, code: string) {
    await this.sendMail({
      to,
      subject: 'Your Login Verification Code',
      html: `
        <h1>Verification Code</h1>
        <p>Your 6-digit verification code is: <strong>${code}</strong></p>
        <p>This code will expire in 5 minutes.</p>
      `,
    });
  }
}
