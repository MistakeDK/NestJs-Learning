import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { CustomException } from './customException';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
interface IResponseError {
  status: HttpStatus;
  message: string;
  timestamp: string;
  stackTrace?: string;
}

@Catch(CustomException)
export class HttpExceptionFillterFilter implements ExceptionFilter {
  catch(exception: CustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const error: IResponseError = {
      message: exception.message,
      status: status,
      timestamp: new Date().toISOString(),
      stackTrace: exception.stack,
    };
    response.status(status).json(error);
  }
}
