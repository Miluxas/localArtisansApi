import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { IRegisterNewUser } from '../../user/interfaces';
import { Role } from '../../common/user-role.constant';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('LINKEDIN_CLIENT_ID'),
      clientSecret: configService.get('LINKEDIN_SECRET'),
      callbackURL: configService.get('LINKEDIN_CALLBACK_URL'),
      scope: ['r_emailaddress', 'r_liteprofile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { emails,photos,name } = profile;
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
