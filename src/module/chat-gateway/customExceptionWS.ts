import { WsException } from '@nestjs/websockets';
import { ErrorCode, mapError } from 'src/config/constantError';

export class CustomExceptionWS extends WsException {
  constructor(errorCode: ErrorCode) {
    const error = mapError[errorCode];
    super(error.message as string);
  }
}
