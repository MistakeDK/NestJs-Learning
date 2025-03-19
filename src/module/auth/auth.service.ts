import { LoginDTO } from './dto/login.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/module/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { generateUUID } from 'src/utils/commom';
import { CustomException } from 'src/http-exception-fillter/customException';
import { ErrorCode } from 'src/config/constantError';
import { ResponseLoginDTO } from './dto/response-login.dto';
import { plainToInstance } from 'class-transformer';
import { Role } from '../role/entities/role.entity';
import { ePermission } from 'src/config/permission.enum';

export interface IPayload {
  gmail: string;
  permission: ePermission[];
}
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async login(loginData: LoginDTO): Promise<ResponseLoginDTO> {
    const user = await this.userRepository.findOne({
      where: {
        gmail: loginData.gmail,
      },
      relations: ['roles', 'roles.permissions'],
    });
    if (!user) {
      throw new CustomException(ErrorCode.USER_NOT_EXIST);
    }
    const isMatch = await bcrypt.compare(loginData.password, user?.password);

    const permissions = user.roles
      .flatMap((role) => role.permissions)
      .map((permission) => permission.permission);

    if (isMatch) {
      const payload = {
        gmail: loginData.gmail,
        permission: permissions,
      };

      const accessToken = await this.jwtService.signAsync(payload, {
        jwtid: generateUUID(),
        expiresIn: 600,
      });

      const refreshToken = await this.jwtService.signAsync(payload, {
        jwtid: generateUUID(),
        expiresIn: '24h',
      });

      return plainToInstance(ResponseLoginDTO, { accessToken, refreshToken });
    } else {
      throw new CustomException(ErrorCode.USER_OR_PASSWORD_INCORRECT);
    }
  }
  async getMe(id: string) {
    const user = this.userRepository.findBy({ id });
    return user;
  }
}
