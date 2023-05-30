import { ApiProperty } from '@nestjs/swagger';

export class AdminRemoveUserResponseDto {
  @ApiProperty()
  link?: string;

  @ApiProperty()
  result: boolean;
}
