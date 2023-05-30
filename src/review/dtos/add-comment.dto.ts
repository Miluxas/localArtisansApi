import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddCommentBodyDto {
  @ApiProperty({ example: 'Cat 1' })
  @IsString()
  content?: string ;

  @ApiProperty({ example: 4 })
  @IsNumber()
  rate: number;
}

export class AddCommentResponseDto {
  @ApiProperty()
  content?: string;

  @ApiProperty()
  rate: number;
}
