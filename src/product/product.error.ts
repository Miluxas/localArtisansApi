import { HttpStatus } from '@nestjs/common';
import { IMessageList } from '../error-handler/error-handler.interface';

export enum ProductError {
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  PRODUCT_IS_OFFLINE = 'PRODUCT_IS_OFFLINE',
  WRONG_COMMAND = 'WRONG_COMMAND',
  WRONG_PROPERTY = 'WRONG_PROPERTY',
}

export const productErrorMessages: IMessageList<ProductError> = {
  [ProductError.PRODUCT_NOT_FOUND]: {
    message: 'product not found',
    status: HttpStatus.NOT_FOUND,
  },
  [ProductError.WRONG_COMMAND]: {
    message: 'command is wrong',
    status: HttpStatus.BAD_REQUEST,
  },
  [ProductError.WRONG_PROPERTY]: {
    message: 'property is wrong',
    status: HttpStatus.BAD_REQUEST,
  },
  [ProductError.PRODUCT_IS_OFFLINE]: {
    message: 'product is offline',
    status: HttpStatus.NOT_FOUND,
  },
};
