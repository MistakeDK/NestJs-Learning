import { Role } from 'src/module/role/entities/role.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypy from 'bcrypt';
import { BaseEntity } from 'src/module/commom/entities/base.entity';
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 256 })
  name: string;
  @Column({ type: 'varchar', length: 256, unique: true })
  gmail: string;
  @Column({ type: 'varchar', length: 256 })
  password: string;

  @ManyToMany(() => Role, { nullable: true })
  @JoinTable()
  roles: Role[];
  @BeforeInsert()
  @BeforeUpdate()
  async hashPasswordCreate() {
    this.password = await bcrypy.hash(this.password, 10);
  }
}
