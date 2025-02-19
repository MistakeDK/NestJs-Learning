import { Body, Controller, Post } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }
}
