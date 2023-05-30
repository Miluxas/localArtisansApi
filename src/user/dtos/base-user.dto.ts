import { ApiProperty } from '@nestjs/swagger';
import { AdminRole } from '../../common/admin-role.constant';

export class BaseUserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: Object.values(AdminRole), required: false })
  role?: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  firstName?: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  emailVerified: boolean;

  @ApiProperty()
  createdAt: Date;
}
