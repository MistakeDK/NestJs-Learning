import { CreateRoleDTO } from './dto/create-role.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { In, Repository } from 'typeorm';
import { DeleteRoleDTO } from './dto/delete-role.dto';
import { Permission } from '../permission/entities/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}
  async create(createRoleDTO: CreateRoleDTO) {
    const { name, description, permissions } = createRoleDTO;
    const permissionEntities = permissions.map((perm) => {
      const permission = new Permission();
      permission.permission = perm;
      return permission;
    });
    const newRole = this.roleRepository.create({
      name,
      description,
      permissions: permissionEntities,
    });
    return await this.roleRepository.save(newRole);
  }
  async delete(deleteRoleDTO: DeleteRoleDTO) {
    return await this.roleRepository.delete({ id: deleteRoleDTO.roleIds });
  }
}
