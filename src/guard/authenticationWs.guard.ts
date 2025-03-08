import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { ErrorCode } from 'src/config/constantError';
import { CustomWsException } from 'src/http-exception-fillter/customExceptionWs';
import { IPayload } from 'src/module/auth/auth.service';
@Injectable()
export class authenticationWsGuard implements CanActivate {
  jwtService: JwtService;
  configService: ConfigService;
  async canActivate(context: ExecutionContext) {
    const req: Socket = context.switchToWs().getClient();
    const authHanshake: string = req.handshake.auth['token'];
    const authHeaders: string = req.handshake.headers['token'] as string;
    if (!authHanshake && !authHeaders) {
      throw new CustomWsException(ErrorCode.UN_AUTHENTICATION);
    }
    const token = authHanshake || authHeaders;
    try {
      const payload = await this.jwtService.verifyAsync<IPayload>(token, {
        secret: this.configService.get<string>('SECRET_KEY'),
      });

      req['user'] = payload;
    } catch {
      throw new CustomWsException(ErrorCode.UN_AUTHENTICATION);
    }
    return true;
  }
}
