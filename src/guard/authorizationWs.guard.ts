import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { ErrorCode } from 'src/config/constantError';
import { ePermission } from 'src/config/permission.enum';
import { PERMISSION_KEY } from 'src/decorator/permission.decorator';
import { CustomWsException } from 'src/http-exception-fillter/customExceptionWs';
import { IPayload } from 'src/module/auth/auth.service';

@Injectable()
export class AuthorizationWsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<ePermission[]>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermission) {
      return true;
    }
    const { user } = context
      .switchToWs()
      .getClient<Socket & { user: IPayload }>();
    if (user.permission.includes(ePermission.SUPER_ADMIN)) {
      return true;
    }
    if (user.permission.length === 0) {
      throw new CustomWsException(ErrorCode.UN_AUTHORIZATION);
    }
    const isHaveAllPermission = requiredPermission.every((perm) =>
      user.permission.includes(perm),
    );
    if (isHaveAllPermission) {
      return true;
    }
    return false;
  }
}
