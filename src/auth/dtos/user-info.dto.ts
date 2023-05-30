import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/user-role.constant';

export class UserInfoResponseDto {
  @ApiProperty({ enum: Object.values(Role) })
  role: string;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty({ required: false })
  emailVerified?: boolean;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  birthDate?: Date;

  @ApiProperty()
  city?: any;
}
