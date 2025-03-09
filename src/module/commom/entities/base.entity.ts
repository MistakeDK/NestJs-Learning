import { BeforeInsert, BeforeUpdate, Column } from 'typeorm';

export abstract class BaseEntity {
  @Column({
    default: null,
  })
  create: string;
  @Column({
    default: null,
  })
  update: string;

  @BeforeInsert()
  beforeInsert() {
    this.create = new Date().toISOString();
  }
  @BeforeUpdate()
  beforeUpdate() {
    this.update = new Date().toISOString();
  }
}
