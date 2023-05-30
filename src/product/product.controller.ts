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

import { ProductError } from "./product.error";
import { ProductService } from "./product.service";
import {
  ProductListResponseDto,
  UserCreateProductBodyDto,
  UserCreateProductResponseDto
} from "./dtos";

@ApiTags(" Product Management")
@Controller("/products")
@Authorization()
export class ProductController {
  constructor(
    private readonly errorHandlerService: ErrorHandlerService<ProductError>,
    private readonly productService: ProductService
  ) {}

  @Get("")
  @ApiCreatedResponse({
    type: ProductListResponseDto,
  })
  async myProductList(
    @Req() requestObject: RequestType
  ): Promise<ProductListResponseDto[] | void> {
    return this.productService
      .myProductList(requestObject.user.id)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }

  @Post("/register")
  @ApiCreatedResponse({
    type: StandardResponseFactory(UserCreateProductResponseDto),
  })
  async register(
    @Body() body: UserCreateProductBodyDto,
    @Req() requestObject: RequestType
  ): Promise<UserCreateProductResponseDto | void> {
    return this.productService
      .register(body.title, requestObject.user.id)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }

}
