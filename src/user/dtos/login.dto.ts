import { ApiProperty } from '@nestjs/swagger';

import { AdminInfoResponseDto } from '../../auth/dtos/admin-info.dto';
import { IsEmail, IsString } from 'class-validator';

export class LoginBodyDto {
  @ApiProperty({ example: 'b.almobarak@gmail.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly password: string;
}

export class LoginResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty({ required: false })
  otpExpires?: Date;

  @ApiProperty()
  user: AdminInfoResponseDto;
}
