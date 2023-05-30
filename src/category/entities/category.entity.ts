import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseModel } from '../../common/base-model';

@Entity()
export class Category extends BaseModel {
  @Column({ length: 30 })
  title: string;

  @Column({})
  isActive: boolean;

  @ManyToOne(() => Category)
  parent?: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];
}
