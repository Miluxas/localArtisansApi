import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/user-role.constant';

export class AdminInfoResponseDto {
  @ApiProperty({ enum: Object.values(Role) })
  role: string;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  status: string;
}
