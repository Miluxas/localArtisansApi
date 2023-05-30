import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginatedListStandardResponseFactory,
  StandardResponseFactory,
} from '../interceptors/formatter/standard-response.factory';

import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { Authorization } from '../helpers/authorizer.decorator';
import { CategoryError } from './category.error';
import { CategoryService } from './category.service';
import {
  AdminCategoryListBodyDto,
  AdminCategoryListResponseDto,
  AdminCreateCategoryBodyDto,
  AdminCreateCategoryResponseDto,
  AdminSetCategoryActivationBodyDto,
  AdminUpdateCategoryBodyDto,
  AdminUpdateCategoryResponseDto,
} from './dtos';
import { IdParamDto } from '../common/common-request.dto';
import { PaginatedList } from '../common/paginated-list.type';

@ApiTags('Admin Category Management')
@Controller('/admin/categories')
@Authorization()
export class AdminCategoryController {
  constructor(
    private readonly errorHandlerService: ErrorHandlerService<CategoryError>,
    private readonly categoryService: CategoryService,
  ) {}

  @Post('')
  @ApiCreatedResponse({
    type: PaginatedListStandardResponseFactory(AdminCategoryListResponseDto),
  })
  async adminCategoryList(
    @Body() body: AdminCategoryListBodyDto,
  ): Promise<PaginatedList<AdminCategoryListResponseDto> | void> {
    return this.categoryService
      .categoryList(body)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }

  @Post('/create')
  @ApiCreatedResponse({
    type: StandardResponseFactory(AdminCreateCategoryResponseDto),
  })
  async register(
    @Body() body: AdminCreateCategoryBodyDto,
  ): Promise<AdminCreateCategoryResponseDto | void> {
    return this.categoryService
      .create(body)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }

  @Put('/:id')
  @ApiCreatedResponse({
    type: StandardResponseFactory(AdminUpdateCategoryResponseDto),
  })
  async update(
    @Body() body: AdminUpdateCategoryBodyDto,
    @Param() param: IdParamDto,
  ): Promise<AdminUpdateCategoryResponseDto | void> {
    return this.categoryService
      .update(param.id, body)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }

  @Put('/:id/activation')
  @Authorization()
  @ApiOkResponse({
    type: StandardResponseFactory(Boolean),
  })
  async setCategoryActivation(
    @Body() body: AdminSetCategoryActivationBodyDto,
    @Param() param: IdParamDto,
  ): Promise<boolean | void> {
    return this.categoryService
      .setActivation(param.id, body.active)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }

  @Get('/:id')
  @ApiCreatedResponse({
    type: StandardResponseFactory(AdminUpdateCategoryResponseDto),
  })
  async getDetail(
    @Param() param: IdParamDto,
  ): Promise<AdminUpdateCategoryResponseDto | void> {
    return this.categoryService
      .getDetail(param.id)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }
}
