import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  USER_NOT_EXIST,
}

interface errorDetail {
  code: HttpStatus;
  message?: string;
}

export const mapError: Record<ErrorCode, errorDetail> = {
  [ErrorCode.USER_NOT_EXIST]: {
    code: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'user is not exist',
  },
};
