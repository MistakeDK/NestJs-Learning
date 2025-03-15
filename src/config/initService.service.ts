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

    let userRole = await this.roleRepository.findOne({
      where: { name: 'User' },
      relations: ['permissions'],
    });

    // Nếu chưa có Role User thì tạo mới
    if (!userRole) {
      userRole = this.roleRepository.create({ name: 'User' });
      userRole = await this.roleRepository.save(userRole);
      console.log('✅ Role User đã được tạo');
    }

    // Nếu chưa có Role Admin thì tạo mới
    if (!adminRole) {
      adminRole = this.roleRepository.create({ name: 'Admin' });
      adminRole = await this.roleRepository.save(adminRole);
      console.log('✅ Role Admin đã được tạo');
    }

    // Danh sách quyền của User Role
    const listRoleUser = [
      ePermission.CAN_CHAT,
      ePermission.CAN_DELETE_ACCOUNT,
      ePermission.CAN_GET_INFO,
      ePermission.CAN_LOGIN,
      ePermission.CAN_UPDATE_INFO,
      ePermission.CAN_VIEW,
    ];

    // Kiểm tra các quyền của User Role hiện có
    const existingUserPermissions = await this.permissionRepository.find({
      where: { role: { id: userRole.id } },
    });

    const existingPermissionsSet = new Set(
      existingUserPermissions.map((perm) => perm.permission),
    );

    // Thêm các quyền bị thiếu vào Role User
    for (const permission of listRoleUser) {
      if (!existingPermissionsSet.has(permission)) {
        const newPermission = this.permissionRepository.create({
          permission,
          role: userRole,
        });
        await this.permissionRepository.save(newPermission);
        console.log(`✅ Permission ${permission} đã được gán cho Role User`);
      }
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
