import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook";
import { AuthService } from "../auth.service";
import { ConfigService } from "@nestjs/config";
import { Role } from "../../common/user-role.constant";
import { IRegisterNewUser } from "../../user/interfaces";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('FACEBOOK_APP_ID'),
      clientSecret: configService.get('FACEBOOK_APP_SECRET'),
      callbackURL: configService.get('FACEBOOK_CALLBACK_URL'),
      scope: "email",
      profileFields: ["emails","name"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {

    const { emails,name } = profile;
    const newUserFromGoogle: IRegisterNewUser = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      role: Role.Normal,
      // picture: photos[0].value,
      // accessToken,
    };
    const existUser = await this.authService.getUserByEmail(newUserFromGoogle.email);
    if (existUser) return existUser;
    await this.authService.registerExternalUser(newUserFromGoogle);
    return await this.authService.getUserByEmail(newUserFromGoogle.email);
  }
}
