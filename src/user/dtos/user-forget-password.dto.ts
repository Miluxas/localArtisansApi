import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


export class UserForgetPasswordBodyDto {
  @ApiProperty({ example: 'b.almobarak@gmail.com' })
  @IsString()
  readonly email: string;
}
