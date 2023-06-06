import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ErrorHandlerModule } from "../error-handler/error-handler.module";
import { AdminOrderController } from "./admin-order.controller";
import { OrderController } from "./order.controller";
import { orderErrorMessages } from "./order.error";
import { OrderService } from "./order.service";
import { Order } from "./entities/order.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    ErrorHandlerModule.register(orderErrorMessages),
  ],
  providers: [OrderService],
  exports: [OrderService],
  controllers: [AdminOrderController, OrderController],
})
export class OrderModule {}
