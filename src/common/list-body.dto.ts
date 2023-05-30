import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class ListBodyDto {
  @ApiProperty({ required: false, example: 0 })
  @IsNumber({ allowNaN: true })
  readonly skip?: number;

  @ApiProperty({ required: false, example: 10 })
  @IsNumber({ allowNaN: true })
  readonly take?: number;

  @ApiProperty({ required: false })
  sort?: any;

  @ApiProperty({ required: false, example: "" })
  @IsString()
  readonly searchQuery?: string;

  @ApiProperty({ required: false })
  filters?: any;
}
