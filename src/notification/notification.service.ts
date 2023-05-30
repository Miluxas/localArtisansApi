import { Injectable } from '@nestjs/common';
import {
  generateAdminForgetPasswordContent,
  generateForgetPasswordOtpCodeContent,
  generateSendOtpEmailContent
} from '../html/emailTemplate';
import { EmailService } from './email.service';
import { OneSignalService } from './one-signal.service';

@Injectable()
export class NotificationService {
  constructor(private readonly emailService: EmailService,
    private readonly oneSignalService:OneSignalService,) {}

  public async sendOtpEmail(
    user: { firstName: string; email: string },
    otpCode: string,
  ) {
    const emailBody = generateSendOtpEmailContent(user.firstName, otpCode);
    return this.emailService.sendEmail(user.email, 'OTP', emailBody);
  }

  public async sendForgetPasswordOtpCodeEmail(
    user: { firstName: string; email: string },
    otpCode: string,
  ) {
    const emailBody = generateForgetPasswordOtpCodeContent(
      user.firstName,
      otpCode,
    );
    return this.emailService.sendEmail(user.email, 'OTP', emailBody);
  }

  public async sendAdminForgetPAsswordEmail(
    user: { firstName: string; email: string },
    link: string,
  ) {
    const emailBody = generateAdminForgetPasswordContent(user.firstName, link);

    await this.emailService.sendEmail(
      user.email,
      'Reset Password Link',
      emailBody,
    );
  }


}
