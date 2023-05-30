import { HttpStatus } from '@nestjs/common';
import { IMessageList } from '../error-handler/error-handler.interface';

export enum UserError {
  NOT_FOUND = 'NOT_FOUND',
  INVALID_ID = 'INVALID_ID',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  DUPLICATE_EMAIL = 'DUPLICATE_EMAIL',
  INVALID_EMAIL = 'INVALID_EMAIL',
  EMAIL_IS_NOT_VERIFIED = 'EMAIL_IS_NOT_VERIFIED',
  WRONG_PASSWORD = 'WRONG_PASSWORD',
  NOT_VALID_ATTACHMENT = 'NOT_VALID_ATTACHMENT',
}

export const userErrorMessages: IMessageList<UserError> = {
  [UserError.NOT_FOUND]: {
    message: 'User not found',
    status: HttpStatus.NOT_FOUND,
  },
  [UserError.INVALID_ID]: {
    message: 'User ID is invalid',
    status: HttpStatus.NOT_FOUND,
  },
  [UserError.TOKEN_EXPIRED]: {
    message: 'Token is expired',
    status: HttpStatus.UNAUTHORIZED,
  },
  [UserError.TOKEN_INVALID]: {
    message: 'Token is invalid',
    status: HttpStatus.UNAUTHORIZED,
  },
  [UserError.DUPLICATE_EMAIL]: {
    message: 'User already exists',
    status: HttpStatus.BAD_REQUEST,
  },
  [UserError.INVALID_EMAIL]: {
    message: 'Email is not valid!',
    status: HttpStatus.BAD_REQUEST,
  },
  [UserError.WRONG_PASSWORD]: {
    message: 'Password is wrong!',
    status: HttpStatus.BAD_REQUEST,
  },
  [UserError.NOT_VALID_ATTACHMENT]: {
    message: 'Not a valid attachment',
    status: HttpStatus.BAD_REQUEST,
  },
  [UserError.EMAIL_IS_NOT_VERIFIED]: {
    message: 'Email is not verified',
    status: HttpStatus.BAD_REQUEST,
  },
};
