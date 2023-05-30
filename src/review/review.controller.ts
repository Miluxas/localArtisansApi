import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Req,
  UsePipes,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { StandardResponseFactory } from '../interceptors/formatter/standard-response.factory';

import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { Authorization } from '../helpers/authorizer.decorator';

import { IdParamDto } from '../common/common-request.dto';
import { RequestType } from '../common/request.type';

import { ReviewService } from './review.service';

import { ReviewError } from './review.error';
import {
  AddCommentBodyDto,
  AddCommentResponseDto,
  DeleteCommentParamDto,
  UpdateCommentBodyDto,
  UpdateCommentParamDto,
  UpdateCommentResponseDto,
} from './dtos';

@ApiTags('Freelancer Package Review Management')
@Controller('/products/:id')
@Authorization()
export class ReviewController {
  constructor(
    private readonly errorHandlerService: ErrorHandlerService<ReviewError>,
    private readonly packageCommentService: ReviewService,
  ) {}

  @Post('/reviews')
  @ApiCreatedResponse({
    type: StandardResponseFactory(AddCommentBodyDto),
  })
  async register(
    @Body() body: AddCommentBodyDto,
    @Param() param: IdParamDto,
    @Req() requestObject: RequestType,
  ): Promise<AddCommentResponseDto | void> {
    return this.packageCommentService
      .create({
        userId: requestObject.user.id,
        content: body.content,
        rate: body.rate,
        productId: param.id,
      })
      .catch((error) => this.errorHandlerService.getMessage(error));
  }

  @Put('/reviews/:commentId')
  @ApiCreatedResponse({
    type: StandardResponseFactory(UpdateCommentResponseDto),
  })
  async update(
    @Body() body: UpdateCommentBodyDto,
    @Param() param: UpdateCommentParamDto,
    @Req() requestObject: RequestType,
  ): Promise<UpdateCommentResponseDto | void> {
    return this.packageCommentService
      .update(
        param.commentId,
        param.id,
        requestObject.user.id,
        body.content,
        body.rate,
      )
      .catch((error) => this.errorHandlerService.getMessage(error));
  }

  @Delete('/reviews/:commentId')
  @ApiOkResponse({
    type: StandardResponseFactory(Boolean),
  })
  async delete(
    @Param() param: DeleteCommentParamDto,
    @Req() requestObject: RequestType,
  ): Promise<boolean | void> {
    return this.packageCommentService
      .delete(param.commentId, param.id, requestObject.user.id)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }
}
