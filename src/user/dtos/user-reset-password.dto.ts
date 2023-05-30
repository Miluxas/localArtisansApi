import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


export class UserResetPasswordBodyDto {
  @ApiProperty({ example: '222222222222' })
  @IsString()
  readonly token: string;
  @ApiProperty({ example: '123123' })
  @IsString()
  readonly password: string;
}
