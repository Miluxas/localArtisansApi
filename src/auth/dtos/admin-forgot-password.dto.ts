import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class AdminForgotPasswordBodyDto {
  @ApiProperty({ example: "milu@axe.com" })
  @IsEmail()
  readonly email: string;
}

export class AdminForgotPasswordResponseDto {
  @ApiProperty()
  tokenExpires?: Date;
}
