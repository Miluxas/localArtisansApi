import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from '../../common/base-model';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class Review extends BaseModel {
  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => Product)
  product: Product;

  @Column({ nullable: true, length: 800 })
  content?: string;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rate: number;

  generateForView() {
    return {
      user: this.user
        ? {
            id: this.user.id,
            firstName: this.user.firstName,
            lastName: this.user.lastName,
          }
        : {},
      content: this.content,
      rate: this.rate,
      createdAt: this.createdAt,
    };
  }
}
