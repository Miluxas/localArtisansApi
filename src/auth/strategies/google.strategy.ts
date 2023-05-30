import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { IRegisterNewUser } from '../../user/interfaces';
import { Role } from '../../common/user-role.constant';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { emails, photos, name } = profile;
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
