import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Permissions } from 'src/decorator/permission.decorator';
import { ePermission } from 'src/config/permission.enum';
import { AuthorizationGuard } from 'src/guard/authorization.guard';
import { IsPublic } from 'src/decorator/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @IsPublic()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthorizationGuard)
  @Permissions([ePermission.CAN_GET_LIST_ACCOUNT])
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Permissions([ePermission.CAN_GET_INFO])
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Permissions([ePermission.CAN_UPDATE_INFO])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Permissions([ePermission.CAN_DELETE_ACCOUNT])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
