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
  ForgotPasswordBodyDto,
  ForgotPasswordResponseDto,
  LoginBodyDto,
  LoginResponseDto,
  OtpEmailBodyDto,
  OtpEmailResponseDto,
  RegisterUserBodyDto,
  RegisterUserResponseDto,
  ResetPasswordBodyDto,
  VerifyResetPasswordOtpBodyDto,
  VerifyResetPasswordOtpResponseDto,
} from "./dtos";

import { UserInfoResponseDto } from "./dtos/user-info.dto";
import { JwtResetPasswordAuthGuard } from "./guards/jwt-reset-password-auth.guard";
import { JwtUnverifiedUserAuthGuard } from "./guards/jwt-unverified-user-auth.guard";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly errorHandlerService: ErrorHandlerService<AuthError>,
    private readonly authService: AuthService
  ) {}
  @Post("/register")
  @ApiCreatedResponse({
    type: StandardResponseFactory(RegisterUserResponseDto),
  })
  async register(
    @Body() body: RegisterUserBodyDto
  ): Promise<RegisterUserResponseDto | void> {
    return this.authService
      .create(body)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }

  @Post("/otp-email")
  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @UseGuards(JwtUnverifiedUserAuthGuard)
  @ApiCreatedResponse({
    type: StandardResponseFactory(OtpEmailResponseDto),
  })
  async otpEmail(
    @Body() body: OtpEmailBodyDto,
    @BearerToken() token
  ): Promise<OtpEmailResponseDto | void> {
    return this.authService
      .otpEmailVerify(body.otp, token)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }

  @Post("/login")
  @ApiCreatedResponse({
    type: StandardResponseFactory(LoginResponseDto),
  })
  async login(
    @Req() req: RequestType,
    @Body() body: LoginBodyDto
  ): Promise<LoginResponseDto | void> {
    return this.authService
      .login(body.email, body.password)
      .then((loggedInUserInfo) => {
        req.user = loggedInUserInfo.user;
        return loggedInUserInfo;
      })
      .catch((error) => this.errorHandlerService.getMessage(error));
  }

  @Post("/forgot-password")
  @ApiOkResponse({
    type: StandardResponseFactory(ForgotPasswordResponseDto),
  })
  async forgotPassword(
    @Body() userForgotPassword: ForgotPasswordBodyDto
  ): Promise<ForgotPasswordResponseDto | void> {
    return this.authService
      .forgotPassword(userForgotPassword.email)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }

  @Post("/verify-reset-password-otp")
  @ApiCreatedResponse({
    type: StandardResponseFactory(VerifyResetPasswordOtpResponseDto),
  })
  async verifyResetPasswordOtp(
    @Body() body: VerifyResetPasswordOtpBodyDto
  ): Promise<VerifyResetPasswordOtpResponseDto | void> {
    return this.authService
      .resetPasswordOtpVerify(body.otp, body.email)
      .then((loggedInUserInfo) => {
        return loggedInUserInfo;
      })
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
      .resetPassword(body.password, token)
      .catch((error) => this.errorHandlerService.getMessage(error));
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

  @Get("/profile")
  @Authorization()
  @ApiCreatedResponse({
    type: StandardResponseFactory(LoginResponseDto),
  })
  profile(@Req() req: RequestType): UserInfoResponseDto {
    return req.user;
  }
}
