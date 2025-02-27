import { Body, Controller, Delete, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDTO } from './dto/create-role.dto';
import { DeleteRoleDTO } from './dto/delete-role.dto';
import { Permissions } from 'src/decorator/permission.decorator';
import { ePermission } from 'src/config/permission.enum';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Permissions([ePermission.CAN_ACTION_ROLE])
  @Post()
  createRole(@Body() createRoleDTO: CreateRoleDTO) {
    return this.roleService.create(createRoleDTO);
  }
  @Permissions([ePermission.CAN_ACTION_ROLE])
  @Delete()
  deleteRole(@Body() deleteRoleDTO: DeleteRoleDTO) {
    return this.roleService.delete(deleteRoleDTO);
  }
}
