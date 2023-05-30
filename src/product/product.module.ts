import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ErrorHandlerModule } from "../error-handler/error-handler.module";
import { AdminProductController } from "./admin-product.controller";
import { ProductController } from "./product.controller";
import { productErrorMessages } from "./product.error";
import { ProductService } from "./product.service";
import { Product } from "./entities/product.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ErrorHandlerModule.register(productErrorMessages),
  ],
  providers: [ProductService],
  exports: [ProductService],
  controllers: [AdminProductController, ProductController],
})
export class ProductModule {}
