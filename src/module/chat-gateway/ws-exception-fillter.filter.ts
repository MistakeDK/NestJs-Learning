import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

@Catch(WsException, Error)
export class WebSocketExceptionFilter implements ExceptionFilter {
  catch(exception: WsException | Error, host: ArgumentsHost) {
    const client: Socket = host.switchToWs().getClient<Socket>();
    const message =
      exception instanceof WsException
        ? exception.getError()
        : exception.message;

    client.emit('exception', {
      status: 'error',
      message: message,
      timestamp: new Date().toISOString(),
    });
  }
}
