
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class AdminSetUserActivationBodyDto {
  @ApiProperty()
  @IsBoolean()
  readonly active: boolean ;
}
