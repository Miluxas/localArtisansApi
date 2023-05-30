import { HttpStatus } from '@nestjs/common';
import { IMessageList } from '../error-handler/error-handler.interface';

export enum AuthError {
  NOT_FOUND = 'NOT_FOUND',
  INVALID_ID = 'INVALID_ID',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  DUPLICATE_EMAIL = 'DUPLICATE_EMAIL',
  INVALID_EMAIL = 'INVALID_EMAIL',
  EMAIL_IS_NOT_VERIFIED = 'EMAIL_IS_NOT_VERIFIED',
  WRONG_PASSWORD = 'WRONG_PASSWORD',
  OTP_INVALID = 'OTP_INVALID',
  NOT_VALID_ATTACHMENT = 'NOT_VALID_ATTACHMENT',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

export const authErrorMessages: IMessageList<AuthError> = {
  [AuthError.NOT_FOUND]: {
    message: 'User not found',
    status: HttpStatus.NOT_FOUND,
  },
  [AuthError.INVALID_ID]: {
    message: 'User ID is invalid',
    status: HttpStatus.NOT_FOUND,
  },
  [AuthError.TOKEN_EXPIRED]: {
    message: 'Token is expired',
    status: HttpStatus.UNAUTHORIZED,
  },
  [AuthError.TOKEN_INVALID]: {
    message: 'Token is invalid',
    status: HttpStatus.UNAUTHORIZED,
  },
  [AuthError.DUPLICATE_EMAIL]: {
    message: 'User already exists',
    status: HttpStatus.BAD_REQUEST,
  },
  [AuthError.INVALID_EMAIL]: {
    message: 'Email is not valid!',
    status: HttpStatus.BAD_REQUEST,
  },
  [AuthError.WRONG_PASSWORD]: {
    message: 'Password is wrong!',
    status: HttpStatus.BAD_REQUEST,
  },
  [AuthError.NOT_VALID_ATTACHMENT]: {
    message: 'Not a valid attachment',
    status: HttpStatus.BAD_REQUEST,
  },
  [AuthError.EMAIL_IS_NOT_VERIFIED]: {
    message: 'Email is not verified',
    status: HttpStatus.BAD_REQUEST,
  },
  [AuthError.OTP_INVALID]: {
    message: 'OTP is not valid',
    status: HttpStatus.BAD_REQUEST,
  },
  [AuthError.UNAUTHORIZED]: {
    message: 'UNAUTHORIZED',
    status: HttpStatus.UNAUTHORIZED,
  },
};
