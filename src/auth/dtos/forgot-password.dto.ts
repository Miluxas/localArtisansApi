import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ForgotPasswordBodyDto {
  @ApiProperty({ example: 'b.almobarak@gmail.com' })
  @IsString()
  readonly email: string ;
}

export class ForgotPasswordResponseDto {
  @ApiProperty()
  otpExpires?: Date;
}
