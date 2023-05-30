import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { StandardResponseFactory } from "../interceptors/formatter/standard-response.factory";

import { RequestType } from "../common/request.type";
import { ErrorHandlerService } from "../error-handler/error-handler.service";
import { Authorization } from "../helpers/authorizer.decorator";
import { AuthError } from "./auth.error";
import { AuthService } from "./auth.service";
import { BearerToken } from "./decorators/bearer-token.decorator";
import {
  AdminForgotPasswordBodyDto,
  AdminForgotPasswordResponseDto,
  LoginBodyDto,
  LoginResponseDto,
  RegisterAdminBodyDto,
  RegisterAdminResponseDto,
  ResetPasswordBodyDto,
} from "./dtos";
import { } from "./dtos/admin-forgot-password.dto";
import { UserInfoResponseDto } from "./dtos/user-info.dto";
import { JwtResetPasswordAuthGuard } from "./guards/jwt-reset-password-auth.guard";

@ApiTags("Admin Auth")
@Controller("admin/auth")
export class AdminAuthController {
  constructor(
    private readonly errorHandlerService: ErrorHandlerService<AuthError>,
    private readonly authService: AuthService
  ) {}

  @Post("/login")
  @ApiCreatedResponse({
    type: StandardResponseFactory(LoginResponseDto),
  })
  async login(
    @Req() req: RequestType,
    @Body() body: LoginBodyDto
  ): Promise<LoginResponseDto | void> {
    return this.authService
      .adminLogin(body.email, body.password)
      .then((loggedInUserInfo) => {
        req.user = loggedInUserInfo.user;
        return loggedInUserInfo;
      })
      .catch((error) => this.errorHandlerService.getMessage(error));
  }

  @Post("/forgot-password")
  @ApiOkResponse({
    type: StandardResponseFactory(AdminForgotPasswordResponseDto),
  })
  async forgotPassword(
    @Body() adminForgotPassword: AdminForgotPasswordBodyDto
  ): Promise<AdminForgotPasswordResponseDto | void> {
    return this.authService
      .adminForgotPassword(adminForgotPassword.email)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }

  @Post("/reset-password")
  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @UseGuards(JwtResetPasswordAuthGuard)
  @ApiCreatedResponse({
    type: StandardResponseFactory(Boolean),
  })
  async ResetPassword(
    @Body() body: ResetPasswordBodyDto,
    @BearerToken() token
  ): Promise<boolean | void> {
    return this.authService
      .adminResetPassword(body.password, token)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }

  @Get("/profile")
  @Authorization()
  @ApiCreatedResponse({
    type: StandardResponseFactory(LoginResponseDto),
  })
  profile(@Req() req: RequestType): UserInfoResponseDto {
    return req.user;
  }

  @Post("/logout")
  @ApiCreatedResponse({
    type: StandardResponseFactory(Boolean),
  })
  async logout(@BearerToken() token): Promise<boolean | void> {
    return this.authService
      .logout(token)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }

  @Post("/register")
  @Authorization()
  @ApiCreatedResponse({
    type: StandardResponseFactory(RegisterAdminResponseDto),
  })
  async registerNewAdmin(
    @Body() body: RegisterAdminBodyDto
  ): Promise<RegisterAdminResponseDto | void> {
    return this.authService
      .registerAdmin(body.email, body.role)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }
}
