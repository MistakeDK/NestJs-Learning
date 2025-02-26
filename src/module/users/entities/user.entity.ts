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
@Entity()
export class User {
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
