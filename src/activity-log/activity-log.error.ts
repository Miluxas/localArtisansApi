import { HttpStatus } from '@nestjs/common';
import { IMessageList } from '../error-handler/error-handler.interface';

export enum ActivityLogError {
  INVALID_EMAIL = 'INVALID_EMAIL',
}

export const activityLogErrorMessages: IMessageList<ActivityLogError> = {
  [ActivityLogError.INVALID_EMAIL]: {
    message: 'email address is NOT valid',
    status: HttpStatus.NOT_FOUND,
  },
};
