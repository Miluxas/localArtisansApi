import { HttpStatus } from '@nestjs/common';
import { IMessageList } from '../error-handler/error-handler.interface';

export enum ReviewError {
  PACKAGE_REVIEW_NOT_FOUND = 'PACKAGE_REVIEW_NOT_FOUND',
}

export const reviewErrorMessages: IMessageList<ReviewError> = {
  [ReviewError.PACKAGE_REVIEW_NOT_FOUND]: {
    message: 'package review not found',
    status: HttpStatus.NOT_FOUND,
  },
};
