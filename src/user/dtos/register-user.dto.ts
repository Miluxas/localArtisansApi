import { ApiProperty } from '@nestjs/swagger';

import { UserInfoResponseDto } from './user-info.dto';
import { Role } from '../../common/user-role.constant';
import { IsEmail, IsString } from 'class-validator';

export class RegisterUserBodyDto {
  @ApiProperty({ example: 'Bashir' })
  @IsString()
  readonly firstName: string;

  @ApiProperty({ example: 'Al Mobarak' })
  @IsString()
  readonly lastName: string;

  @ApiProperty({ example: 'b.almobarak@gmail.com' })
  @IsEmail()
  readonly email: string ;

  @ApiProperty()
  @IsString()
  readonly password: string ;

  @ApiProperty({ enum: Object.values(Role), example: Role.Normal })
  @IsString()
  readonly role: Role ;
}

export class RegisterUserResponseDto {
  // @ApiProperty()
  // token: string;

  @ApiProperty()
  otpExpires: Date;

  @ApiProperty()
  user: UserInfoResponseDto;
}
