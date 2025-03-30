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
import { ePermission } from 'src/config/permission.enum';
import { ResponseGetMe } from './dto/response-getMe.dto';
import { CacheAppService } from '../cache/cacheApp.service';
import { RegisterDTO } from './dto/register.dto';
import { Role } from '../role/entities/role.entity';
export interface IPayload {
  gmail: string;
  permission: ePermission[];
  idUser: string;
  jti?: string;
  exp?: number;
  iat?: number;
}
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private cacheAppSerice: CacheAppService,
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
      const payload: IPayload = {
        gmail: loginData.gmail,
        permission: permissions,
        idUser: user.id,
      };

      const accessToken = await this.jwtService.signAsync(payload, {
        jwtid: generateUUID(),
        expiresIn: 600000,
      });

      const refreshToken = await this.jwtService.signAsync(payload, {
        jwtid: generateUUID(),
        expiresIn: '24h',
      });

      return plainToInstance(ResponseLoginDTO, {
        accessToken: accessToken,
        refreshToken: refreshToken,
        id: user.id,
      });
    } else {
      throw new CustomException(ErrorCode.USER_OR_PASSWORD_INCORRECT);
    }
  }

  async register(registerData: RegisterDTO) {
    const roleDefault = await this.roleRepository.find({
      where: {
        name: 'User',
      },
    });
    const newUser = this.userRepository.create({
      ...registerData,
      roles: roleDefault,
    });
    await this.userRepository.save(newUser);
  }

  async logout(request: Request) {
    const infoLogin: IPayload = request['user'];
    const currentTimeStamp = Math.floor(Date.now() / 1000);
    const ttl = (infoLogin.exp ?? 0) - currentTimeStamp;
    if (ttl > 0) {
      this.cacheAppSerice.setValue(`invalidToken:${infoLogin.jti}`, true, ttl);
      return 'logout success';
    }
    return 'token already logout';
  }

  async getMe(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new CustomException(ErrorCode.USER_NOT_EXIST);
    }
    return plainToInstance(ResponseGetMe, {
      gmail: user.gmail,
      name: user.name,
    });
  }
}
