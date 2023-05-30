import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedListStandardResponseFactory } from '../interceptors/formatter/standard-response.factory';

import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { CategoryError } from './category.error';
import { CategoryService } from './category.service';
import {
  CategoryListBodyDto,
  CategoryListResponseDto,
} from './dtos';
import { PaginatedList } from '../common/paginated-list.type';

@ApiTags(' Category Management')
@Controller('/categories')
export class CategoryController {
  constructor(
    private readonly errorHandlerService: ErrorHandlerService<CategoryError>,
    private readonly categoryService: CategoryService,
  ) {}

  @Post('')
  @ApiCreatedResponse({
    type: PaginatedListStandardResponseFactory(CategoryListResponseDto),
  })
  async categoryList(
    @Body() body: CategoryListBodyDto,
  ): Promise<PaginatedList<CategoryListResponseDto> | void> {
    return this.categoryService
      .categoryList(body)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }
}
