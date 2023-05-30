import {  Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { ActionType, InnerActivity } from '../activity-log/types/activity.type';
import { AdminRole } from '../common/admin-role.constant';
import { EmailSanitizer } from '../helpers/email-sanitizer';
import { Identity } from '../identity/entities/identity.entity';
import { IdentityType } from '../identity/identity-type.constant';
import { IdentityService } from '../identity/identity.service';
import { NotificationService } from '../notification/notification.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthError, authErrorMessages } from './auth.error';
import { CodeGeneratorService } from './code-generator.service';
import { IUserInfo } from './interfaces';
import { Otp } from './types/otp.type';
import { ResetPasswordToken } from './types/reset-password-token.type';
import { IRegisterNewUser } from '../user/interfaces';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  private RESET_PASSWORD_BASE_URL: string;
  constructor(
    protected readonly userService: UserService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    protected readonly configService: ConfigService,
    protected readonly notificationService: NotificationService,
    protected readonly identityService: IdentityService,
    protected readonly jwtService: JwtService,
    protected readonly codeGeneratorService: CodeGeneratorService,
  ) {
    this.RESET_PASSWORD_BASE_URL = this.configService.get(
      'RESET_PASSWORD_BASE_URL',
    );
  }

  public async create(user) {
    const newUser = await this.userService.create(user);
    const { token, otpExpiresAt } = await this.handleOtpToken(newUser);
    return { user: newUser, token, otpExpires: otpExpiresAt };
  }

  private async handleOtpToken(newUser: IUserInfo) {
    const token = this.generateTempAccessToken(newUser.email, newUser.id);
    const otpCode = this.codeGeneratorService.generateCode(6);
    const newOtp: Otp = { value: otpCode, userId: newUser.id };
    const cacheKey = `${otpCode}###${token}`;
    const otpTtl = this.configService.get('OTP_EXPIRES') ?? 600;
    await this.cacheManager.set<Otp>(cacheKey, newOtp, {
      ttl: otpTtl,
    });
    const otpExpiresAt = new Date(new Date().getTime() + 1000 * otpTtl);

    await this.notificationService.sendOtpEmail(newUser, otpCode);
    return { token, otpExpiresAt };
  }

  public async otpEmailVerify(
    otp: string,
    token: string,
  ): Promise<{ user: IUserInfo; token: string }> {
    if (!token) throw new Error(AuthError.OTP_INVALID);

    const cacheKey = `${otp}###${token}`;

    const otpObject: Otp = await this.cacheManager.get<Otp>(cacheKey);
    if (!otpObject) {
      throw new Error(AuthError.OTP_INVALID);
    }
    const user = await this.userService.verifyUser(otpObject.userId);
    await this.cacheManager.del(cacheKey);

    const loggedInUser = this.userService.getUserInfo(user);
    return {
      user: loggedInUser,
      token: this.generateAccessToken(loggedInUser),
    };
  }

  public async getVerifiedActivatedUser(
    email: string,
    type: IdentityType,
  ): Promise<IUserInfo> {
    const sanitizedEmail = EmailSanitizer.normalizeEmail(email);

    const identity = await this.identityService.getVerifiedActivated(
      sanitizedEmail,
      type,
    );
    if (!identity) {
      return null;
    }
    const user = await this.userService.findUserByIdentityId(identity.id);
    if (!user) {
      return null;
    }
    return this.userService.getUserInfo(user);
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: IUserInfo; token: string; otpExpires?: Date }> | null {
    const sanitizedEmail = EmailSanitizer.normalizeEmail(email);

    const identity = await this.identityService.validate(
      sanitizedEmail,
      password,
      IdentityType.User,
    );
    return this.handleLogin(identity);
  }

  private async handleLogin(identity: Identity) {
    const user = await this.userService.findUserByIdentityId(identity.id);
    const loggedInUser = this.userService.getUserInfo(user);

    if (identity.emailVerified)
      return {
        user: loggedInUser,
        token: this.generateAccessToken(loggedInUser),
      };
    else {
      const { token, otpExpiresAt } = await this.handleOtpToken(loggedInUser);
      return { user: loggedInUser, token, otpExpires: otpExpiresAt };
    }
  }

  async adminLogin(
    email: string,
    password: string,
  ): Promise<{ user: IUserInfo; token: string; otpExpires?: Date }> | null {
    const sanitizedEmail = EmailSanitizer.normalizeEmail(email);
    const identity = await this.identityService.validate(
      sanitizedEmail,
      password,
      IdentityType.Admin,
    );
    return this.handleLogin(identity);
  }

  public generateAccessToken(user: IUserInfo): string {
    const payload = {
      email: user.email,
      type: user.type,
      sub: user.id,
    };
    return this.jwtService.sign(payload);
  }

  public generateTempAccessToken(email, id): string {
    const payload = {
      unverifiedUserEmail: email,
      unverifiedUserId: id,
    };
    return this.jwtService.sign(payload);
  }

  public verifyBearer(bearer: string) {
    if (!bearer) return;
    try {
      return this.jwtService.verify(bearer.split(' ')[1] ?? '');
    } catch {
      throw authErrorMessages[AuthError.UNAUTHORIZED];
    }
  }

  public async forgotPassword(email: string): Promise<{ otpExpires: Date }> {
    const sanitizedEmail = EmailSanitizer.normalizeEmail(email);

    const identity = await this.identityService.getActivated(
      sanitizedEmail,
      IdentityType.User,
    );
    if (!identity) throw new Error(AuthError.INVALID_EMAIL);

    const user = await this.userService.findUserByIdentityId(identity.id);
    const otpCode = this.codeGeneratorService.generateCode(6);
    const newOtp: Otp = { value: otpCode, userId: user.id };
    const cacheKey = `${otpCode}###${identity.username}`;
    const otpTtl = this.configService.get('OTP_EXPIRES') ?? 600;
    await this.cacheManager.set<Otp>(cacheKey, newOtp, {
      ttl: otpTtl,
    });
    const otpExpiresAt = new Date(new Date().getTime() + 1000 * otpTtl);

    await this.notificationService.sendForgetPasswordOtpCodeEmail(
      user,
      otpCode,
    );
    return { otpExpires: otpExpiresAt };
  }

  public generateResetPasswordAccessToken(
    email,
    id,
    expiresInSec = 3600,
  ): string {
    const payload = {
      userRequestedResetPasswordEmail: email,
      userRequestedResetPasswordIdentityId: id,
    };
    return this.jwtService.sign(payload, { expiresIn: `${expiresInSec}s` });
  }

  public async resetPasswordOtpVerify(
    otp: string,
    email: string,
  ): Promise<{ resetPasswordToken: string }> {
    const cacheKey = `${otp}###${email}`;
    const otpObject: Otp = await this.cacheManager.get<Otp>(cacheKey);
    if (!otpObject) {
      throw new Error(AuthError.OTP_INVALID);
    }
    await this.cacheManager.del(cacheKey);
    const user = await this.userService.getUser(otpObject.userId);
    const resetPasswordToken = this.generateResetPasswordAccessToken(
      user.email,
      user.identity.id,
    );
    return { resetPasswordToken };
  }

  public async resetPassword(
    newPassword: string,
    token: string,
  ): Promise<boolean> {
    if (!token) throw new Error(AuthError.OTP_INVALID);
    const tokenObject = this.jwtService.verify<{
      userRequestedResetPasswordIdentityId: number;
    }>(token);
    if (!tokenObject) {
      throw new Error(AuthError.TOKEN_INVALID);
    }
    return this.identityService.resetPassword(
      tokenObject.userRequestedResetPasswordIdentityId,
      newPassword,
    );
  }

  public async logout(token: string): Promise<boolean> {
    if (!token) throw new Error(AuthError.TOKEN_INVALID);

    const tokenObject = this.jwtService.decode(token);

    if (!tokenObject) {
      throw new Error(AuthError.TOKEN_INVALID);
    }
    try {
      const ttl = Math.round(
        tokenObject['exp'] - (new Date().getTime() + 1) / 1000,
      );
      await this.cacheManager.set<number>(token, tokenObject['sub'], {
        ttl: ttl,
      });
    } catch {
      return true;
    }
    return true;
  }

  public async adminForgotPassword(
    email: string,
  ): Promise<{ tokenExpires: Date; resetPasswordToken?: string }> {
    const sanitizedEmail = EmailSanitizer.normalizeEmail(email);
    const identity = await this.identityService.getAdminForResetPassword(
      sanitizedEmail,
      IdentityType.Admin,
    );

    if (!identity) throw new Error(AuthError.INVALID_EMAIL);

    const user = await this.userService.findUserByIdentityId(identity.id);
    const { tokenExpiresAt, resetPasswordToken } =
      await this.handleResetPasswordLinkEmail(user);
    if (this.configService.get('NODE_ENV') == 'test')
      return { tokenExpires: tokenExpiresAt, resetPasswordToken };
    return { tokenExpires: tokenExpiresAt };
  }

  private async handleResetPasswordLinkEmail(user: User) {
    const linkExpires =
      this.configService.get('RESET_PASSWORD_LINK_EXPIRES') ?? 3600;

    const resetPasswordToken = this.generateResetPasswordAccessToken(
      user.email,
      user.identity.id,
      linkExpires,
    );
    await this.cacheManager.set<ResetPasswordToken>(
      resetPasswordToken,
      { userId: user.id, resetPasswordToken },
      {
        ttl: linkExpires,
      },
    );
    const tokenExpiresAt = new Date(new Date().getTime() + 1000 * linkExpires);
    const resetPasswordLinkPrefix = this.configService.get(
      'RESET_PASSWORD_BASE_URL',
    );

    await this.notificationService.sendForgetPasswordOtpCodeEmail(
      user,
      `${resetPasswordLinkPrefix}${resetPasswordToken}`,
    );
    return { tokenExpiresAt, resetPasswordToken };
  }

  public async adminResetPassword(
    newPassword: string,
    token: string,
  ): Promise<boolean> {
    if (!token) throw new Error(AuthError.OTP_INVALID);
    const resetPasswordToken: ResetPasswordToken =
      await this.cacheManager.get<ResetPasswordToken>(token);
    if (!resetPasswordToken) {
      throw new Error(AuthError.TOKEN_INVALID);
    }
    await this.cacheManager.del(token);
    const tokenObject = this.jwtService.verify<{
      userRequestedResetPasswordIdentityId: number;
    }>(token);
    if (!tokenObject) {
      throw new Error(AuthError.TOKEN_INVALID);
    }
    return this.identityService.resetPassword(
      tokenObject.userRequestedResetPasswordIdentityId,
      newPassword,
    );
  }

  public async registerAdmin(email: string, role: AdminRole) {
    const newUser = await this.userService.registerNewAdmin(email, role);
    const { tokenExpiresAt, resetPasswordToken } =
      await this.handleResetPasswordLinkEmail(newUser);

    const user = this.userService.getUserInfo(newUser);
    if (this.configService.get('NODE_ENV') === 'test')
      return { tokenExpiresAt, resetPasswordToken, user };
    return { tokenExpiresAt, user };
  }

  public async registerExternalUser(user: IRegisterNewUser) {
    const newUser = await this.userService.registerExternalUser(user);
    // this.asyncContext.set('service', {
    //   entity: { name: 'User', id: newUser.id },
    //   action: { type: ActionType.CREATE, info: { new: newUser } },
    // });
    return newUser;
  }
  public async getUserByEmail(email: string) {
    const sanitizedEmail = EmailSanitizer.normalizeEmail(email);
    const identity = await this.identityService.getVerifiedActivated(
      sanitizedEmail,
      IdentityType.User,
    );
    if (!identity) {
      return null;
    }
    const user = await this.userService.findUserByIdentityId(identity.id);
    if (!user) {
      return null;
    }
    return { identity };
  }

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }
    return this.handleLogin(req.user.identity);
  }

  facebookLogin(req) {
    if (!req.user) {
      return 'No user from facebook';
    }
    return this.handleLogin(req.user.identity);
  }

  linkedinLogin(req) {
    if (!req.user) {
      return 'No user from linkedin';
    }
    return this.handleLogin(req.user.identity);
  }
}
