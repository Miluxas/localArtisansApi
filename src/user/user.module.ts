import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ErrorHandlerModule } from "../error-handler/error-handler.module";
import { identityErrorMessages } from "../identity/identity.error";
import { IdentityModule } from "../identity/identity.module";
import { notificationErrorMessages } from "../notification/notification.error";
import { NotificationModule } from "../notification/notification.module";
import { AdminAdministratorController } from "./admin-administrator.controller";
import { AdminUserController } from "./admin-user.controller";
import { User } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { userErrorMessages } from "./user.error";
import { UserService } from "./user.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    NotificationModule,
    ConfigModule,
    IdentityModule,
    ErrorHandlerModule.register({
      ...userErrorMessages,
      ...notificationErrorMessages,
      ...identityErrorMessages,
    }),
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [
    UserController,
    AdminUserController,
    AdminAdministratorController,
  ],
})
export class UserModule {}
