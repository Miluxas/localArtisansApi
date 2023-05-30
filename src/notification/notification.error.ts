import { HttpStatus } from '@nestjs/common';
import { IMessageList } from '../error-handler/error-handler.interface';

export enum NotificationError {
  INVALID_EMAIL = 'INVALID_EMAIL',
  EMAIL_SEND_ERROR = 'EMAIL_SEND_ERROR',
}

export const notificationErrorMessages: IMessageList<NotificationError> = {
  [NotificationError.INVALID_EMAIL]: {
    message: 'email address is NOT valid',

    status: HttpStatus.NOT_FOUND,
  },
  [NotificationError.EMAIL_SEND_ERROR]: {
    message: 'An error occurred while sending the email',
    status: HttpStatus.BAD_REQUEST,
  },
};
