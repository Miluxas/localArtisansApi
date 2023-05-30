import { PartialType } from "@nestjs/mapped-types";
import { AdminCreateUserBodyDto } from "./admin-create-user.dto";

export class AdminUpdateUserInfoBodyDto extends PartialType(
  AdminCreateUserBodyDto
) {}
