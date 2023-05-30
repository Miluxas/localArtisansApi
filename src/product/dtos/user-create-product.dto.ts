
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserCreateProductBodyDto {
  @ApiProperty({ example: 'Product 1' })
  @IsString()
  readonly title: string;
}

export class UserCreateProductResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  publicKey: string;
}
