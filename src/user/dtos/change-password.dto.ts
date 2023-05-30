import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


const message = {
  'any.required': 'Password is a required field',
  'string.min': 'Password must be at least 6 characters.',
};

export class ChangePasswordBodyDto {
  @ApiProperty()
  @IsString()
  readonly oldPassword: string;

  @ApiProperty()
  @IsString()
  readonly  newPassword: string;
}
