import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { notificationErrorMessages } from './notification.error';
import { NotificationService } from './notification.service';
import { ErrorHandlerModule } from '../error-handler/error-handler.module';
import { EmailService } from './email.service';
import { OneSignalService } from './one-signal.service';
import { NotificationController } from './notification.controller';

@Module({
  imports: [
    ConfigModule,
    ErrorHandlerModule.register(notificationErrorMessages),
  ],
  providers: [NotificationService, EmailService, OneSignalService],
  exports: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
