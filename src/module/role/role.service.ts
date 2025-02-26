import { CreateRoleDTO } from './dto/create-role.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { In, Repository } from 'typeorm';
import { DeleteRoleDTO } from './dto/delete-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}
  async create(createRoleDTO: CreateRoleDTO) {
    const newRole = this.roleRepository.create(createRoleDTO);
    return await this.roleRepository.save(newRole);
  }
  async delete(deleteRoleDTO: DeleteRoleDTO) {
    return await this.roleRepository.delete({ id: deleteRoleDTO.roleIds });
  }
}
