import { Controller, Get, Req } from "@nestjs/common";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { StandardResponseFactory } from "../interceptors/formatter/standard-response.factory";

import { ErrorHandlerService } from "../error-handler/error-handler.service";

import { RequestType } from "../common/request.type";
import { Authorization } from "../helpers/authorizer.decorator";
import { NotificationError } from "./notification.error";
import { OneSignalService } from "./one-signal.service";

@ApiTags(" User Notifications")
@Controller("/notification")
@Authorization()
export class NotificationController {
  constructor(
    private readonly errorHandlerService: ErrorHandlerService<NotificationError>,
    private readonly oneSignalService: OneSignalService
  ) {}

  @Get("/user-id-auth-hash")
  @ApiCreatedResponse({
    type: StandardResponseFactory(String),
  })
  async getUserIdAuthHash(
    @Req() requestObject: RequestType
  ): Promise<string | void> {
    return this.oneSignalService.createHashMac(
      requestObject.user.id.toString()
    );
  }
}
