import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


export class SendVerificationCodeBodyDto {
  @ApiProperty({ example: 'b.almobarak@gmail.com' })
  @IsString()
  readonly email: string;
}
