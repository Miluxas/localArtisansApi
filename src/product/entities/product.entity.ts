import { Column, Entity, ManyToOne } from "typeorm";
import { Category } from "../../category/entities/category.entity";
import { BaseModel } from "../../common/base-model";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Product extends BaseModel {
  @ManyToOne(() => User)
  artisan: User;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  price: number;

  @ManyToOne(() => Category)
  category: Category;

  @Column({ type: "json", nullable: true })
  tags?: [string];
}
