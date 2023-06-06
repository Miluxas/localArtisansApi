import { HttpStatus } from '@nestjs/common';
import { IMessageList } from '../error-handler/error-handler.interface';

export enum OrderError {
  ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',
  ORDER_IS_OFFLINE = 'ORDER_IS_OFFLINE',
  WRONG_COMMAND = 'WRONG_COMMAND',
  WRONG_PROPERTY = 'WRONG_PROPERTY',
}

export const orderErrorMessages: IMessageList<OrderError> = {
  [OrderError.ORDER_NOT_FOUND]: {
    message: 'order not found',
    status: HttpStatus.NOT_FOUND,
  },
  [OrderError.WRONG_COMMAND]: {
    message: 'command is wrong',
    status: HttpStatus.BAD_REQUEST,
  },
  [OrderError.WRONG_PROPERTY]: {
    message: 'property is wrong',
    status: HttpStatus.BAD_REQUEST,
  },
  [OrderError.ORDER_IS_OFFLINE]: {
    message: 'order is offline',
    status: HttpStatus.NOT_FOUND,
  },
};
