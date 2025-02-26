import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import { InitService } from 'src/config/initService.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission])],
  providers: [InitService],
})
export class CommomModule {}
