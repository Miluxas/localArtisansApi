import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class VerifyResetPasswordOtpBodyDto {
  @ApiProperty({ example: 'b.almobarak@gmail.com' })
  @IsEmail()
  readonly email: string ;

  @ApiProperty()
  @IsString()
  readonly otp: string;
}
export class VerifyResetPasswordOtpResponseDto {
  @ApiProperty()
  resetPasswordToken: string;
}
