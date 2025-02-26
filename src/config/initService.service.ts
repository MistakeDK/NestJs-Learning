import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Permission } from 'src/module/permission/entities/permission.entity';
import { Role } from 'src/module/role/entities/role.entity';
import { User } from 'src/module/users/entities/user.entity';
import { ePermission } from './permission.enum';

@Injectable()
export class InitService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async onApplicationBootstrap() {
    console.log('🚀 Chạy SeedService để tạo dữ liệu mặc định...');
    await this.createDefaultUserAndRole();
  }

  private async createDefaultUserAndRole() {
    // 1️⃣ Kiểm tra xem role "Admin" đã tồn tại chưa
    let adminRole = await this.roleRepository.findOne({
      where: { name: 'Admin' },
      relations: ['permissions'],
    });

    if (!adminRole) {
      adminRole = this.roleRepository.create({ name: 'Admin' });
      await this.roleRepository.save(adminRole);
      console.log('✅ Role Admin đã được tạo');
    }

    // 2️⃣ Kiểm tra và tạo tất cả permission từ enum
    const existingPermissions = await this.permissionRepository.find();
    const allPermissions = Object.values(ePermission);

    if (existingPermissions.length < allPermissions.length) {
      const newPermissions = allPermissions
        .filter(
          (perm) => !existingPermissions.some((p) => p.permission === perm),
        )
        .map((perm) => {
          const newPermission = new Permission();
          newPermission.permission = perm as ePermission;
          newPermission.role = adminRole;
          return newPermission;
        });
      await this.permissionRepository.save(newPermissions);
      console.log('✅ Tất cả permission đã được tạo và gán vào role Admin');
    }

    // 3️⃣ Kiểm tra xem user admin có tồn tại không
    let adminUser = await this.userRepository.findOne({
      where: { gmail: 'admin@gmail.com' },
      relations: ['roles'],
    });

    if (!adminUser) {
      adminUser = this.userRepository.create({
        name: 'Admin',
        gmail: 'admin@gmail.com',
        password: '123456',
        roles: [adminRole], // Gán role Admin cho user này
      });

      await this.userRepository.save(adminUser);
      console.log('✅ User Admin đã được tạo');
    } else {
      // Nếu user đã có nhưng chưa có role Admin, thêm vào
      if (!adminUser.roles.some((role) => role.id === adminRole.id)) {
        adminUser.roles.push(adminRole);
        await this.userRepository.save(adminUser);
        console.log('✅ User Admin đã được gán thêm role Admin');
      }
    }

    console.log('🎉 Seed dữ liệu hoàn tất!');
  }
}
