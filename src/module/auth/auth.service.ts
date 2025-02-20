import { LoginDTO } from './dto/login.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/module/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { generateUUID } from 'src/utils/commom';
import { CustomException } from 'src/http-exception-fillter/customException';
import { ErrorCode } from 'src/config/constantError';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async login(loginData: LoginDTO) {
    const user = await this.userRepository.findOne({
      where: {
        gmail: loginData.gmail,
      },
    });
    if (!user) {
      throw new CustomException(ErrorCode.USER_NOT_EXIST);
    }
    const isMatch = await bcrypt.compare(loginData.password, user?.password);
    if (isMatch) {
      const payload = {
        gmail: loginData.gmail,
      };

      return await this.jwtService.signAsync(payload, {
        jwtid: generateUUID(),
        expiresIn: 600,
      });
    } else {
      return 'login fail';
    }
  }
}
