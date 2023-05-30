import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Identity } from './identity.entity';
import { Permission } from './permission.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn({})
  id: number;

  @Column({})
  title: string;

  @OneToMany(() => Identity, (identity) => identity.role)
  identities: Identity[];

  @ManyToMany(() => Permission)
  permissions: Permission[];

  constructor(title) {
    this.title = title;
  }
}
