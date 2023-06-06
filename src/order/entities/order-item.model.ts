import { Product } from "../../product/entities/product.entity";
import { User } from "../../user/entities/user.entity";

export class OrderItem {
  customer: User;

  product: Product;

  price: number;

  count: number;
}
