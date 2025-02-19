import { LoginDTO } from './dto/login.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/module/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { generateUUID } from 'src/utils/commom';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  async login(loginData: LoginDTO) {
    const user = await this.userRepository.findOne({
      where: {
        gmail: loginData.gmail,
      },
    });
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
