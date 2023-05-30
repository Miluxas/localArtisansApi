
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class AdminSetProductActivationBodyDto {
  @ApiProperty()
  @IsBoolean()
  readonly active: boolean;
}
