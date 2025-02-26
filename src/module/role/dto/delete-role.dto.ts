import { IsArray, IsNotEmpty } from 'class-validator';

export class DeleteRoleDTO {
  @IsNotEmpty()
  roleIds: string;
}
