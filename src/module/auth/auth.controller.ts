import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ResponseLoginDTO } from './dto/response-login.dto';
import { RoleGuard } from 'src/guard/role.guard';
@Controller('auth')
@UseGuards(new RoleGuard())
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDTO: LoginDTO): Promise<ResponseLoginDTO> {
    return this.authService.login(loginDTO);
  }
}
