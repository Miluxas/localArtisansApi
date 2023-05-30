import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { NotificationError } from './notification.error';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  public sendEmail(to: string, subject: string, page: string): Promise<string> {
    if (!this.isValidEmail(to))
      throw new Error(NotificationError.INVALID_EMAIL);
    const transporter = this.createTransport();

    return transporter
      .sendMail({
        from: `"${this.configService.get(
          'MAIL_FROM_NAME',
        )}" <${this.configService.get('MAIL_NAME')}>`,
        to,
        subject,
        html: page,
      })
      .then((info) => {
        console.error(info.messageId);
        return info.messageId;
      })
      .catch((error: Error) => {
        console.error(error);
        throw new Error(NotificationError.EMAIL_SEND_ERROR);
      });
  }

  private createTransport() {
    return nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      // secure: this.configService.get('MAIL_SECURE'),
      secure: false,
      auth: {
        user: this.configService.get('MAIL_USERNAME'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
      tls: {
        ciphers: 'SSLv3',
      },
    });
  }

  private isValidEmail(emailAddress: string): boolean {
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return !!emailAddress.match(regexEmail);
  }
}
