import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class AdminCreateCategoryBodyDto {
  @ApiProperty({ example: 'Cat 1' })
  @IsString()
  title: string 

  @ApiProperty({ example: true })
  @IsBoolean()
  isActive: boolean 

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  parentId?: number
}

export class AdminCreateCategoryResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ type: AdminCreateCategoryBodyDto })
  parent?: AdminCreateCategoryResponseDto;

}
