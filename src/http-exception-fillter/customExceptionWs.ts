import { WsException } from '@nestjs/websockets';
import { ErrorCode, mapError } from 'src/config/constantError';

export class CustomWsException extends WsException {
  constructor(ErrorCode: ErrorCode) {
    const error = mapError[ErrorCode];
    super(error.message as string);
  }
}
