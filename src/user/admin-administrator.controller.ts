import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { IdParamDto } from "../common/common-request.dto";
import { PaginatedList } from "../common/paginated-list.type";
import { ErrorHandlerService } from "../error-handler/error-handler.service";
import { Authorization } from "../helpers/authorizer.decorator";

import { IdentityError } from "../identity/identity.error";
import {
  PaginatedListStandardResponseFactory,
  StandardResponseFactory,
} from "../interceptors/formatter/standard-response.factory";
import { UserService } from "../user/user.service";
import {
  AdminDetailResponseDto,
  AdminListBodyDto,
  AdminListResponseDto,
} from "./dtos";

@ApiTags("Admin Administrators Management")
@Controller("/admin/administrators")
@Authorization()
export class AdminAdministratorController {
  constructor(
    private readonly errorHandlerService: ErrorHandlerService<IdentityError>,
    private readonly userService: UserService
  ) {}

  @Post("")
  @ApiCreatedResponse({
    type: PaginatedListStandardResponseFactory(AdminListResponseDto),
  })
  async adminList(
    @Body() body: AdminListBodyDto
  ): Promise<PaginatedList<AdminListResponseDto> | void> {
    return this.userService.adminList(body).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Get("/:id")
  @ApiOkResponse({
    type: StandardResponseFactory(AdminDetailResponseDto),
  })
  async detail(
    @Param() param: IdParamDto
  ): Promise<AdminDetailResponseDto | void> {
    return this.userService.detail(param.id).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }
}
