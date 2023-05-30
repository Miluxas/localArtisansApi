import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IdentityType } from '../../identity/identity-type.constant';
import { AuthService } from '../auth.service';
import { IUserInfo } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(validationPayload: {
    email: string;
    sub: string;
    type: IdentityType;
  }): Promise<IUserInfo> {
    if (validationPayload?.email) {
      return this.authService.getVerifiedActivatedUser(
        validationPayload.email,
        validationPayload.type,
      );
    }
    return null;
  }
}
