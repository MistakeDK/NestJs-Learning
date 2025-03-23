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
import { RegisterDTO } from './dto/register.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @IsPublic()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDTO: LoginDTO): Promise<ResponseLoginDTO> {
    return this.authService.login(loginDTO);
  }

  @IsPublic()
  @Post('/register')
  @HttpCode(HttpStatus.OK)
  register(@Body() registerDTO: RegisterDTO) {
    return this.authService.register(registerDTO);
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
