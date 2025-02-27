import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { PermissionService } from './permission.service';

import { DeletePermisisonRoleDTO } from './dto/delete-permission-Role.dto';
import { AddPermissionRoleDTO } from './dto/add-permission-role.dto';
import { Permissions } from 'src/decorator/permission.decorator';
import { ePermission } from 'src/config/permission.enum';

@Controller('/permission')
export class PermissonController {
  constructor(private readonly permissionService: PermissionService) {}

  @Permissions([ePermission.CAN_ACTION_ROLE])
  @Delete()
  deletePermissionInRole(
    @Body() deletePermissionRoleDTO: DeletePermisisonRoleDTO,
  ) {
    return this.permissionService.deletePermissionInRole(
      deletePermissionRoleDTO,
    );
  }

  @Permissions([ePermission.CAN_ACTION_ROLE])
  @Post()
  createPermissionInRole(@Body() addPermisisonRoleDTO: AddPermissionRoleDTO) {
    return this.permissionService.createPermissionInRole(addPermisisonRoleDTO);
  }
}
