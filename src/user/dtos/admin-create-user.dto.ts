
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class AdminCreateUserBodyDto {
  @ApiProperty({ example: 'Bashir' })
  @IsString()
  readonly firstName: string;

  @ApiProperty({ example: 'Al Mobarak' })
  @IsString()
  readonly lastName: string;

  @ApiProperty({ example: 'b.almobarak@gmail.com' })
  @IsEmail()
  readonly email: string;
}

export class AdminCreateUserResponseDto {
  @ApiProperty()
  avatar?: string;

  @ApiProperty()
  emailVerified: boolean;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}
