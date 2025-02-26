import { Body, Controller, Delete, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDTO } from './dto/create-role.dto';
import { DeleteRoleDTO } from './dto/delete-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post()
  createRole(@Body() createRoleDTO: CreateRoleDTO) {
    return this.roleService.create(createRoleDTO);
  }
  @Delete()
  deleteRole(@Body() deleteRoleDTO: DeleteRoleDTO) {
    return this.roleService.delete(deleteRoleDTO);
  }
}
