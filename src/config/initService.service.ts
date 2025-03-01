import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/module/permission/entities/permission.entity';
import { Role } from 'src/module/role/entities/role.entity';
import { User } from 'src/module/users/entities/user.entity';
import { Repository } from 'typeorm';
import { ePermission } from './permission.enum';

@Injectable()
export class InitService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async onApplicationBootstrap() {
    console.log('🚀 Chạy InitService để tạo dữ liệu mặc định...');
    await this.createDefaultRoleAndPermissions();
    await this.createDefaultAdminUser();
    console.log('🎉 Seed dữ liệu hoàn tất!');
  }

  private async createDefaultRoleAndPermissions() {
    let adminRole = await this.roleRepository.findOne({
      where: { name: 'Admin' },
      relations: ['permissions'],
    });

    if (!adminRole) {
      adminRole = this.roleRepository.create({ name: 'Admin' });
      adminRole = await this.roleRepository.save(adminRole);
      console.log('✅ Role Admin đã được tạo');
    }

    // Kiểm tra nếu quyền SUPER_ADMIN đã tồn tại trong Role Admin chưa
    const hasSuperAdminPermission = await this.permissionRepository.findOne({
      where: {
        permission: ePermission.SUPER_ADMIN,
        role: { id: adminRole.id },
      },
    });

    if (!hasSuperAdminPermission) {
      const permissionSuperAdmin = this.permissionRepository.create({
        permission: ePermission.SUPER_ADMIN,
        role: adminRole,
      });
      await this.permissionRepository.save(permissionSuperAdmin);
      console.log('✅ Permission SUPER_ADMIN đã được gán cho Role Admin');
    }
  }

  private async createDefaultAdminUser() {
    let adminUser = await this.userRepository.findOne({
      where: { gmail: 'admin@gmail.com' },
      relations: ['roles'],
    });

    const adminRole = await this.roleRepository.findOne({
      where: { name: 'Admin' },
    });

    if (!adminUser) {
      adminUser = this.userRepository.create({
        name: 'Admin',
        gmail: 'admin@gmail.com',
        password: '123456',
        roles: [adminRole as Role],
      });
      await this.userRepository.save(adminUser);
      console.log('✅ User Admin đã được tạo');
    } else if (!adminUser.roles.some((role) => role.id === adminRole?.id)) {
      adminUser.roles.push(adminRole as Role);
      await this.userRepository.save(adminUser);
      console.log('✅ User Admin đã được gán thêm role Admin');
    }
  }
}
