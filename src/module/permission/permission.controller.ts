import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { PermissionService } from './permission.service';

import { DeletePermisisonRoleDTO } from './dto/delete-permission-Role.dto';
import { AddPermissionRoleDTO } from './dto/add-permission-role.dto';

@Controller('/permission')
export class PermissonController {
  constructor(private readonly permissionService: PermissionService) {}
  @Delete()
  deletePermissionInRole(
    @Body() deletePermissionRoleDTO: DeletePermisisonRoleDTO,
  ) {
    return this.permissionService.deletePermissionInRole(
      deletePermissionRoleDTO,
    );
  }

  @Post()
  createPermissionInRole(@Body() addPermisisonRoleDTO: AddPermissionRoleDTO) {
    return this.permissionService.createPermissionInRole(addPermisisonRoleDTO);
  }
}
