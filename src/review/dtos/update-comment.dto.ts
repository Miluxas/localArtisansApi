import { ApiProperty } from '@nestjs/swagger';
import { AddCommentBodyDto, AddCommentResponseDto } from './add-comment.dto';
import { IsNumber } from 'class-validator';

export class UpdateCommentBodyDto extends AddCommentBodyDto {}

export class UpdateCommentParamDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  commentId: number;
}

export class UpdateCommentResponseDto extends AddCommentResponseDto {}
