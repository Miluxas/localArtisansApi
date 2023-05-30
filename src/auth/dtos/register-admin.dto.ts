import { ApiProperty } from '@nestjs/swagger';
import { AdminRole } from '../../common/admin-role.constant';
import { AdminInfoResponseDto } from './admin-info.dto';
import { IsString } from 'class-validator';

export class RegisterAdminBodyDto {
  @ApiProperty({ example: 'b.almobarak@gmail.com' })
  @IsString()
  readonly email: string 

  @ApiProperty({ enum: AdminRole, example: AdminRole.Admin })
  @IsString()
  readonly role: AdminRole ;
}

export class RegisterAdminResponseDto {
  @ApiProperty()
  tokenExpiresAt: Date;

  @ApiProperty()
  user: AdminInfoResponseDto;
}
