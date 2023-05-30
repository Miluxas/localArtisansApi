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
import { ProductError } from "./product.error";
import { ProductService } from "./product.service";
import {
  AdminProductListBodyDto,
  AdminProductListResponseDto,
  AdminSetProductActivationBodyDto,
  AdminUpdateProductResponseDto
} from "./dtos";

@ApiTags("Admin Product Management")
@Controller("/admin/products")
@Authorization()
export class AdminProductController {
  constructor(
    private readonly errorHandlerService: ErrorHandlerService<ProductError>,
    private readonly productService: ProductService
  ) {}

  @Post("")
  @ApiCreatedResponse({
    type: PaginatedListStandardResponseFactory(AdminProductListResponseDto),
  })
  async adminProductList(
    @Body() body: AdminProductListBodyDto
  ): Promise<PaginatedList<AdminProductListResponseDto> | void> {
    return this.productService
      .productList(body)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }

  @Get("/:id")
  @ApiCreatedResponse({
    type: StandardResponseFactory(AdminUpdateProductResponseDto),
  })
  async getDetail(
    @Param() param: IdParamDto
  ): Promise<AdminUpdateProductResponseDto | void> {
    return this.productService
      .getDetail(param.id)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }
}
