
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class IdParamDto {
  @ApiProperty()
  @IsNumber()
  readonly id: number;
}
