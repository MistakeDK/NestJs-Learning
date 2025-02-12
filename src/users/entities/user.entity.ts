import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 256 })
  name: string;
  @Column({ type: 'varchar', length: 256 })
  gmail: string;
  constructor(id: string, name: string, gmail: string) {
    this.gmail = gmail;
    this.id = id;
    this.name = name;
  }
}
