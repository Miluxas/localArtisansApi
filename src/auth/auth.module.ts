import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ErrorHandlerModule } from "../error-handler/error-handler.module";
import { identityErrorMessages } from "../identity/identity.error";
import { IdentityModule } from "../identity/identity.module";
import { notificationErrorMessages } from "../notification/notification.error";
import { NotificationModule } from "../notification/notification.module";
import { UserModule } from "../user/user.module";
import { AdminAuthController } from "./admin-auth.controller";
import { AuthController } from "./auth.controller";
import { authErrorMessages } from "./auth.error";
import { AuthService } from "./auth.service";
import { CodeGeneratorService } from "./code-generator.service";
import { FacebookController } from "./facebook.controller";
import { GoogleController } from "./google.controller";
import { LinkedInController } from "./linkedin.controller";
import { FacebookStrategy } from "./strategies/facebook.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LinkedInStrategy } from "./strategies/linkedin.strategy";

@Module({
  imports: [
    UserModule,
    IdentityModule,
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get("JWT_EXPIRES_IN"),
        },
      }),
      inject: [ConfigService],
    }),
    NotificationModule,
    ErrorHandlerModule.register({
      ...authErrorMessages,
      ...notificationErrorMessages,
      ...identityErrorMessages,
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    CodeGeneratorService,
    FacebookStrategy,
    LinkedInStrategy,
    GoogleStrategy,
  ],
  exports: [AuthService, JwtStrategy],
  controllers: [
    AuthController,
    AdminAuthController,
    FacebookController,
    LinkedInController,
    GoogleController,
  ],
})
export class AuthModule {}
