import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResetPasswordBodyDto {
  @ApiProperty()
  @IsString()
  readonly password: string;
}
