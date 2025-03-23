import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ResponseLoginDTO } from './dto/response-login.dto';
import { IsPublic } from 'src/decorator/public.decorator';
import { IsSameUser } from 'src/decorator/IsSameUser.decorator';
import { Request } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @IsPublic()
  @Post()
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDTO: LoginDTO): Promise<ResponseLoginDTO> {
    return this.authService.login(loginDTO);
  }

  @Patch()
  logout(@Req() request: Request) {
    return this.authService.logout(request);
  }

  @Get('/:id')
  @IsSameUser()
  getMe(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.getMe(id);
  }
}
