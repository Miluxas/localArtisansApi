import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";
import { OrderStatus } from "../entities/order-status.enum";

export class OrderItemBodyDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  readonly productId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  readonly count: number;
}

export class RegisterOrderBodyDto {
  @ApiProperty({ type: OrderItemBodyDto, isArray: true, required: true })
  @IsArray({ each: true })
  readonly items: OrderItemBodyDto[];
}

export class RegisterOrderResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  status: OrderStatus;

  @ApiProperty()
  totalAmount: number;
}
