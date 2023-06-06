import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UsePipes
} from "@nestjs/common";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import {
  StandardResponseFactory
} from "../interceptors/formatter/standard-response.factory";

import { IdParamDto } from "../common/common-request.dto";
import { RequestType } from "../common/request.type";
import { ErrorHandlerService } from "../error-handler/error-handler.service";
import { Authorization } from "../helpers/authorizer.decorator";

import { OrderError } from "./order.error";
import { OrderService } from "./order.service";
import {
  OrderListResponseDto,
  RegisterOrderBodyDto,
  RegisterOrderResponseDto
} from "./dtos";

@ApiTags(" Order Management")
@Controller("/orders")
@Authorization()
export class OrderController {
  constructor(
    private readonly errorHandlerService: ErrorHandlerService<OrderError>,
    private readonly orderService: OrderService
  ) {}

  @Get("")
  @ApiCreatedResponse({
    type: OrderListResponseDto,
  })
  async myOrderList(
    @Req() requestObject: RequestType
  ): Promise<OrderListResponseDto[] | void> {
    return this.orderService
      .myOrderList(requestObject.user.id)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }


}
