import { Body, Controller, Post } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { ErrorHandlerService } from "../error-handler/error-handler.service";

import { Authorization } from "../helpers/authorizer.decorator";
import { PaginatedListStandardResponseFactory } from "../interceptors/formatter/standard-response.factory";
import { UserListBodyDto, UserListResponseDto } from "./dtos/user-list.dto";
import { UserError } from "./user.error";
import { UserService } from "./user.service";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(
    private readonly errorHandlerService: ErrorHandlerService<UserError>,
    private readonly userService: UserService
  ) {}

  @Post()
  @Authorization()
  @ApiOkResponse({
    type: PaginatedListStandardResponseFactory(UserListResponseDto),
  })
  async list(@Body() body: UserListBodyDto) {
    return this.userService.list(body).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }
}
