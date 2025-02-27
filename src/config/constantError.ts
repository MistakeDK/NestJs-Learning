import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  UN_AUTHENTICATION,
  UN_AUTHORIZATION,
  USER_NOT_EXIST,
  USER_OR_PASSWORD_INCORRECT,
  PASSWORD_TOO_SHORT,
}

interface errorDetail {
  code: HttpStatus;
  message?: string;
}

export const mapError: Record<ErrorCode, errorDetail> = {
  [ErrorCode.UN_AUTHENTICATION]: {
    code: HttpStatus.UNAUTHORIZED,
    message: 'UnAuthentication',
  },
  [ErrorCode.UN_AUTHORIZATION]: {
    code: HttpStatus.FORBIDDEN,
    message: 'UnAuthorization',
  },
  [ErrorCode.USER_NOT_EXIST]: {
    code: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'user is not exist',
  },
  [ErrorCode.USER_OR_PASSWORD_INCORRECT]: {
    code: HttpStatus.BAD_REQUEST,
    message: 'email or password in correct',
  },
  [ErrorCode.PASSWORD_TOO_SHORT]: {
    code: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Pass word too short {0}',
  },
};
