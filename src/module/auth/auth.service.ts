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
    });
    if (!user) {
      throw new CustomException(ErrorCode.USER_NOT_EXIST);
    }
    const isMatch = await bcrypt.compare(loginData.password, user?.password);
    if (isMatch) {
      const payload = {
        gmail: loginData.gmail,
      };
      const token = await this.jwtService.signAsync(payload, {
        jwtid: generateUUID(),
        expiresIn: 600,
      });
      return plainToInstance(ResponseLoginDTO, { token });
    } else {
      throw new CustomException(ErrorCode.USER_OR_PASSWORD_INCORRECT);
    }
  }
}
