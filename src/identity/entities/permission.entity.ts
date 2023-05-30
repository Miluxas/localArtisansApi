import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn({})
  id: number;

  @Column({})
  path: string;

  @Column({})
  method: string;

  @ManyToMany(() => Role, { eager: true, cascade: true })
  @JoinTable()
  roles: Role[];

  constructor(path, method) {
    this.path = path;
    this.method = method;
  }
}
