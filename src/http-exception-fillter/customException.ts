import { ErrorCode, mapError } from './../config/constantError';
import { HttpException } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(ErrorCode: ErrorCode) {
    const error = mapError[ErrorCode];
    super(error.message as string, error.code);
  }
}
