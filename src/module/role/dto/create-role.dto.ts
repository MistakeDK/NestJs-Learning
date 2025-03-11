import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { ePermission } from 'src/config/permission.enum';

export class CreateRoleDTO {
  @IsNotEmpty()
  name: string;
  description: string;
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(ePermission, { each: true })
  permissions: ePermission[];
}
