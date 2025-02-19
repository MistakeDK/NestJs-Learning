import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypy from 'bcrypt';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 256 })
  name: string;
  @Column({ type: 'varchar', length: 256 })
  gmail: string;
  @Column({ type: 'varchar', length: 256 })
  password: string;
  @BeforeInsert()
  @BeforeUpdate()
  async hashPasswordCreate() {
    this.password = await bcrypy.hash(this.password, 10);
  }
}
