
import { ApiProperty } from '@nestjs/swagger';
import { ListBodyDto } from '../../common/list-body.dto';
import { Gender } from '../entities/user.enums';

export class UserListBodyDto extends ListBodyDto {}

export class UserListResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiProperty({ required: false })
  firstName?: string;
  @ApiProperty({ required: false })
  lastName?: string;
  @ApiProperty({ required: false })
  birthDate?: Date;
  @ApiProperty({ required: false })
  gender?: Gender;
  @ApiProperty({ required: false })
  bio?: string;
  @ApiProperty({ required: false })
  phoneNumber?: string;
  @ApiProperty({ required: false })
  status: string;
}
