import { Column, Entity } from 'typeorm';
import { BaseModel } from '../../common/base-model';

@Entity()
export class Setting extends BaseModel {
  @Column({})
  name: string;

  @Column({ type: 'json' })
  value: Object;
}
