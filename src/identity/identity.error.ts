import { HttpStatus } from '@nestjs/common';
import { IMessageList } from '../error-handler/error-handler.interface';

export enum IdentityError {
  UNAUTHORIZED = 'UNAUTHORIZED',
  BAD_CREDENTIAL = 'BAD_CREDENTIAL',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  DUPLICATE_EMAIL = 'DUPLICATE_EMAIL',
  INVALID_EMAIL = 'INVALID_EMAIL',
  EMAIL_IS_NOT_VERIFIED = 'EMAIL_IS_NOT_VERIFIED',
  WRONG_PASSWORD = 'WRONG_PASSWORD',
}

export const identityErrorMessages: IMessageList<IdentityError> = {
  [IdentityError.UNAUTHORIZED]: {
    message: 'UNAUTHORIZED',
    status: HttpStatus.UNAUTHORIZED,
  },
  [IdentityError.BAD_CREDENTIAL]: {
    message: 'Email password combination is not correct.',
    status: HttpStatus.BAD_REQUEST,
  },
  [IdentityError.INVALID_EMAIL]: {
    message: 'Email is not valid!',
    status: HttpStatus.BAD_REQUEST,
  },
  [IdentityError.TOKEN_EXPIRED]: {
    message: 'Token is expired',
    status: HttpStatus.UNAUTHORIZED,
  },
  [IdentityError.TOKEN_INVALID]: {
    message: 'Token is invalid',
    status: HttpStatus.UNAUTHORIZED,
  },
  [IdentityError.DUPLICATE_EMAIL]: {
    message: 'User already exists',
    status: HttpStatus.BAD_REQUEST,
  },
  [IdentityError.WRONG_PASSWORD]: {
    message: 'Password is wrong!',
    status: HttpStatus.BAD_REQUEST,
  },
  [IdentityError.EMAIL_IS_NOT_VERIFIED]: {
    message: 'Email is not verified',
    status: HttpStatus.BAD_REQUEST,
  },
};
