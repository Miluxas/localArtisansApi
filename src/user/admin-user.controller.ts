import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { IdParamDto } from "../common/common-request.dto";
import { ErrorHandlerService } from "../error-handler/error-handler.service";
import { Authorization } from "../helpers/authorizer.decorator";

import {
  PaginatedListStandardResponseFactory,
  StandardResponseFactory,
} from "../interceptors/formatter/standard-response.factory";
import {
  AdminSetUserActivationBodyDto,
  UserListBodyDto,
  UserListResponseDto,
} from "./dtos";
import { UserError } from "./user.error";
import { UserService } from "./user.service";

@ApiTags("Admin User")
@Controller("admin/user")
@Authorization()
export class AdminUserController {
  constructor(
    private readonly errorHandlerService: ErrorHandlerService<UserError>,
    private readonly userService: UserService
  ) {}

  @Get("/admin-layer-access")
  @ApiOkResponse({
    type: StandardResponseFactory({}),
  })
  async adminLayerAccessTest() {
    return "ok";
  }

  @Put("/:id/activation")
  @ApiOkResponse({
    type: StandardResponseFactory(Boolean),
  })
  async setUserActivation(
    @Body() body: AdminSetUserActivationBodyDto,
    @Param() param: IdParamDto
  ) {
    return this.userService
      .setUserActivation(param.id, body.active)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }
  @Get("/list")
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
