import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import {
  PaginatedListStandardResponseFactory,
  StandardResponseFactory,
} from "../interceptors/formatter/standard-response.factory";

import { IdParamDto } from "../common/common-request.dto";
import { PaginatedList } from "../common/paginated-list.type";
import { ErrorHandlerService } from "../error-handler/error-handler.service";
import { Authorization } from "../helpers/authorizer.decorator";
import { OrderError } from "./order.error";
import { OrderService } from "./order.service";
import {
  AdminOrderListBodyDto,
  AdminOrderListResponseDto,
} from "./dtos";

@ApiTags("Admin Order Management")
@Controller("/admin/orders")
@Authorization()
export class AdminOrderController {
  constructor(
    private readonly errorHandlerService: ErrorHandlerService<OrderError>,
    private readonly orderService: OrderService
  ) {}

  @Post("")
  @ApiCreatedResponse({
    type: PaginatedListStandardResponseFactory(AdminOrderListResponseDto),
  })
  async adminOrderList(
    @Body() body: AdminOrderListBodyDto
  ): Promise<PaginatedList<AdminOrderListResponseDto> | void> {
    return this.orderService
      .orderList(body)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }
}
