import { ApiProperty } from '@nestjs/swagger';

export class AdminSetCategoryActivationBodyDto {
  @ApiProperty()
  active: boolean 
}

