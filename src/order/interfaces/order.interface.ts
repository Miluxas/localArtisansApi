import { OrderStatus } from "../entities/order-status.enum";
import { IOrderProduct } from "./order-product.interface";

export interface IOrder {
  status: OrderStatus;
  items: IOrderProduct[];
  totalAmount: number;
}
