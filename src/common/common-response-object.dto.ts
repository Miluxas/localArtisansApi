import { ApiProperty } from '@nestjs/swagger';

export class SimpleResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;
}

export class CityResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;
}

export class CountryResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;
}

export class SimpleUserInfoResponseDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}
