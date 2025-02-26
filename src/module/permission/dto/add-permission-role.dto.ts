import { IS_LENGTH, IsArray, IsNotEmpty } from 'class-validator';
import { ePermission } from 'src/config/permission.enum';

export class AddPermissionRoleDTO {
  @IsArray()
  @IsNotEmpty()
  listPermission: ePermission[];
  @IsNotEmpty()
  roleId: string;
}
