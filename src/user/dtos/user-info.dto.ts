import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/user-role.constant';

export class UserInfoResponseDto {
  @ApiProperty({ enum: Object.values(Role) })
  role: Role;

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
