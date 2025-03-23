import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { CustomException } from 'src/http-exception-fillter/customException';
import { ErrorCode } from 'src/config/constantError';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { idRoles } = createUserDto;
    const newUser = this.userRepository.create(createUserDto);
    if (idRoles && idRoles.length > 0) {
      const roles = await this.roleRepository.findBy({ id: In(idRoles) });
      if (roles.length !== idRoles.length) {
        throw new CustomException(ErrorCode.IN_VALID_ROLE);
      }
      newUser.roles = roles;
    }

    await this.userRepository.save(newUser);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    return await this.userRepository.findBy({
      id: id,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { idRoles } = updateUserDto;
    const userCurrent = await this.userRepository.findOneBy({ id });
    if (userCurrent === null) {
      throw new CustomException(ErrorCode.USER_NOT_EXIST);
    }
    if ((idRoles as string[]).length > 0) {
      const roles = await this.roleRepository.findBy({
        id: In(idRoles as string[]),
      });
      if (roles.length !== (idRoles as string[]).length) {
        throw new CustomException(ErrorCode.IN_VALID_ROLE);
      }
      userCurrent.roles = roles;
    }

    return await this.userRepository.update(id, userCurrent);
  }

  async remove(id: string) {
    return await this.userRepository.delete(id);
  }
}
