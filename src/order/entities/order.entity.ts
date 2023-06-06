import { Column, Entity, ManyToOne } from "typeorm";
import { BaseModel } from "../../common/base-model";
import { User } from "../../user/entities/user.entity";
import { OrderItem } from "./order-item.model";
import { OrderStatus } from "./order-status.enum";

@Entity()
export class Order extends BaseModel {
  @ManyToOne(() => User)
  customer: User;

  @Column({ type: "json" })
  items: OrderItem;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.pending,
  })
  status: OrderStatus;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  totalAmount: number;
}
