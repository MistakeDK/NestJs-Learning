import { Permission } from 'src/module/permission/entities/permission.entity';
import { User } from 'src/module/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 256, unique: true })
  name: string;
  @Column({ type: 'varbit', length: 256, nullable: true })
  description?: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @OneToMany(() => Permission, (permission) => permission.role, {
    cascade: true,
  })
  permissions: Permission[];
}
