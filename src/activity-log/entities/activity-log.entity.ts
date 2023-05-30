import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ActivityLog {
  @PrimaryGeneratedColumn({})
  id: number;

  @Column({})
  responseTime: number;

  @CreateDateColumn()
  sentAt: Date;

  @Column({ type: 'json', nullable: true })
  user?: JSON;

  @Column({ type: 'json', nullable: true })
  request?: JSON;

  @Column({ type: 'json', nullable: true })
  response?: JSON;

  @Column({ type: 'json', nullable: true })
  entity?: JSON;

  @Column({ type: 'json', nullable: true })
  action?: JSON;
}
