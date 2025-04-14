import { IPayload } from './../module/auth/auth.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ePermission } from 'src/config/permission.enum';
import { PERMISSION_KEY } from 'src/decorator/permission.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
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
    const { user } = context.switchToHttp().getRequest();
    if ((user as IPayload).permission.includes(ePermission.SUPER_ADMIN)) {
      return true;
    }
    if ((user as IPayload).permission.length === 0) {
      return false;
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
