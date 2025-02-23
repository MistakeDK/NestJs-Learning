import { ErrorCode, mapError } from './../config/constantError';
import { HttpException } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(ErrorCode: ErrorCode, prop?: string[]) {
    const error = mapError[ErrorCode];
    let errorMessage = error.message as string;
    if (prop) {
      errorMessage = errorMessage.replace(
        /\{(\d+)\}/g,
        (_, index) => prop[Number(index)] || `{${index}}`,
      );
    }
    super(errorMessage as string, error.code);
  }
}
