import { SetMetadata } from '@nestjs/common';
import { ePermission } from 'src/config/permission.enum';

export const PERMISSION_KEY = 'permission';
export const Permissions = (permission: ePermission[]) =>
  SetMetadata(PERMISSION_KEY, permission);
