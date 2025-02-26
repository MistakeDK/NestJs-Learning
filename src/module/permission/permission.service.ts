import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { DeleteResult, In, Repository } from 'typeorm';
import { DeletePermisisonRoleDTO } from './dto/delete-permission-Role.dto';
import { AddPermissionRoleDTO } from './dto/add-permission-role.dto';
import { Role } from '../role/entities/role.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}
  async deletePermissionInRole(
    deletePermisionRoleDTO: DeletePermisisonRoleDTO,
  ) {
    return await this.permissionRepository.delete({
      id: In(deletePermisionRoleDTO.listIdsDelete),
    });
  }
  async createPermissionInRole(addPermissionRoleDTO: AddPermissionRoleDTO) {
    const role = await this.roleRepository.findOneBy({
      id: addPermissionRoleDTO.roleId,
    });
    if (!role) {
      throw new NotFoundException();
    }
    const list = addPermissionRoleDTO.listPermission.map((item) => {
      return {
        permission: item,
        role: role,
      };
    });
    const newListPermission = this.permissionRepository.create(list);
    return await this.permissionRepository.save(newListPermission);
  }
}
