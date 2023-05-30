import { HttpStatus } from '@nestjs/common';
import { ErrorResponseMessageType } from '../interceptors/formatter/formatter.interface';

export class ValidationError extends Error {
  constructor(payload,status) {
    super();
    this.meta={
        message: 'Validation Error',
        validationErrors: payload,
        messageType: ErrorResponseMessageType.VALIDATION_ERROR,
        code: HttpStatus.BAD_REQUEST,
      };
    this.status=status;
  }
  public meta: any;
  public status: HttpStatus;
}
