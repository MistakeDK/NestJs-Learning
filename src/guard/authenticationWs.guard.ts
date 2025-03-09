import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Socket } from 'socket.io';
import { ErrorCode } from 'src/config/constantError';
import { CustomWsException } from 'src/http-exception-fillter/customExceptionWs';
import { IPayload } from 'src/module/auth/auth.service';
@Injectable()
export class authenticationWsGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const req: Socket = context.switchToWs().getClient();
    const authHanshake: string = req.handshake.auth['token'];
    const authHeaders: string = req.handshake.headers['token'] as string;
    const token = authHanshake || authHeaders;
    if (!token) {
      throw new CustomWsException(ErrorCode.UN_AUTHENTICATION);
    }
    try {
      const payload = await this.jwtService.verifyAsync<IPayload>(token);
      req['user'] = payload;
    } catch {
      throw new CustomWsException(ErrorCode.UN_AUTHENTICATION);
    }
    return true;
  }
}
