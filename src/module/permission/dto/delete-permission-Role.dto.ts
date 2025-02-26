import { IsArray, IsNotEmpty } from 'class-validator';

export class DeletePermisisonRoleDTO {
  @IsArray()
  @IsNotEmpty()
  listIdsDelete: string[];
}
