import { ApiProperty } from '@nestjs/swagger';
import { UserInfoResponseDto } from './user-info.dto';
import { IsString } from 'class-validator';

export class OtpEmailBodyDto {
  @ApiProperty({ example: '343456' })
  @IsString()
  readonly otp: string 
}

export class OtpEmailResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  user: UserInfoResponseDto;
}
