import { ePermission } from 'src/config/permission.enum';
import { Role } from 'src/module/role/entities/role.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'enum', enum: ePermission })
  permission: ePermission;
  @ManyToOne(() => Role, (role) => role.permissions)
  role: Role;
}
