import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Category } from "../../category/entities/category.entity";
import { BaseModel } from "../../common/base-model";
import { User } from "../../user/entities/user.entity";
import { Review } from "../../review/entities/review.entity";

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

  @OneToMany(() => Review, (review) => review.product, {
    eager: true,
  })
  reviews: Review[];
}
