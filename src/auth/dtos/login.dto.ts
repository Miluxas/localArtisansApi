import { ApiProperty } from '@nestjs/swagger';
import { UserInfoResponseDto } from './user-info.dto';
import { IsString } from 'class-validator';

export class LoginBodyDto {
  @ApiProperty({ example: 'b.almobarak@gmail.com' })
  @IsString()
  readonly email: string 

  @ApiProperty()
  @IsString()
 readonly password: string
}


export class LoginResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty({ required: false })
  otpExpires?: Date;

  @ApiProperty()
  user: UserInfoResponseDto;
}
