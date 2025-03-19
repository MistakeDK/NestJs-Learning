import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ErrorCode } from 'src/config/constantError';
import { IS_SAME_USER } from 'src/decorator/IsSameUser.decorator';
import { IS_PUBLIC_KEY } from 'src/decorator/public.decorator';
import { CustomException } from 'src/http-exception-fillter/customException';
import { IPayload } from 'src/module/auth/auth.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isSameUser = this.reflector.getAllAndOverride<boolean>(IS_SAME_USER, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      console.log(token);
      throw new CustomException(ErrorCode.UN_AUTHENTICATION);
    }
    try {
      const payload = await this.jwtService.verifyAsync<IPayload>(token, {
        secret: this.configService.get<string>('SECRET_KEY'),
      });
      if (isSameUser && request.url.split('/').pop() !== payload.idUser) {
        throw new CustomException(ErrorCode.UN_AUTHENTICATION);
      }
      request['user'] = payload;
    } catch {
      throw new CustomException(ErrorCode.UN_AUTHENTICATION);
    }
    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
