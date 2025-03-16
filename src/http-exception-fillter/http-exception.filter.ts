import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CustomException } from './customException';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ErrorCode, mapError } from 'src/config/constantError';
interface IResponseError {
  status: HttpStatus;
  message: string;
  timestamp: string;
  stackTrace?: string;
}

@Catch(CustomException)
export class HttpExceptionFillter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}
  catch(exception: CustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const error: IResponseError = {
      message: exception.message,
      status: status,
      timestamp: new Date().toISOString(),
      stackTrace: this.configService.getOrThrow<boolean>('IS_PRODUCTION')
        ? exception.stack
        : '',
    };
    response.status(status).json(error);
  }
}

@Catch()
export class CatchAllException implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const error: IResponseError = {
      message: mapError[ErrorCode.UN_HANDLE_EXCEPTION].message as string,
      status: mapError[ErrorCode.UN_HANDLE_EXCEPTION].code,
      timestamp: new Date().toISOString(),
      stackTrace: this.configService.getOrThrow<boolean>('IS_PRODUCTION')
        ? exception.stack
        : '',
    };
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
  }
}
