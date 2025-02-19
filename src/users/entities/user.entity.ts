import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
