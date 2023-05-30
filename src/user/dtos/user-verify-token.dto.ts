import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


export class UserVerifyTokenBodyDto {
  @ApiProperty({ example: '222222222222' })
  @IsString()
  readonly token: string;
}
