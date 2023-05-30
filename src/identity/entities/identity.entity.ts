import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import { IdentityType } from '../identity-type.constant';
import { Role } from './role.entity';

@Entity()
export class Identity {
  @PrimaryGeneratedColumn({})
  id: number;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({})
  username: string;

  @Column({ default: IdentityType.User })
  type: IdentityType;

  @Column({ default: false })
  emailVerified?: boolean;

  @Column({ nullable: true, select: false })
  password?: string;

  @Column({ default: true })
  active?: boolean;

  @ManyToOne(() => Role, { eager: true })
  role: Role;

  token?: string;
}
