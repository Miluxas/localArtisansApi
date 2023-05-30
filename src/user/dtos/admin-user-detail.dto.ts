import { ApiProperty } from '@nestjs/swagger';

export class AdminUserDetailResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({})
  role: string;

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
