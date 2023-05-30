import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { IsNull, Not, Repository } from 'typeorm';
import { Identity } from './entities/identity.entity';
import { IdentityType } from './identity-type.constant';
import { IdentityError } from './identity.error';
import { PermissionService } from './permission.service';
import { RoleService } from './role.service';

@Injectable()
export class IdentityService {
  private readonly ENCRYPTION_IV = Buffer.alloc(16, 1);
  constructor(
    @InjectRepository(Identity)
    private readonly identityRepository: Repository<Identity>,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
    protected readonly configService: ConfigService
  ) {}

  async check(role: string, path: string, method: string): Promise<boolean> {
    return this.permissionService.check(role, path, method);
  }

  async validate(
    username: string,
    password: string,
    type: IdentityType,
  ): Promise<Identity> | null {
    const identity = await this.getActivated(username, type);
    if (identity && (await bcrypt.compare(password, identity.password))) {
      delete identity.password;
      return identity;
    }
    throw new Error(IdentityError.BAD_CREDENTIAL);
  }

  public async getVerifiedActivated(
    username: string,
    type: IdentityType,
  ): Promise<Identity> {
    if (username == undefined) return null;
    return this.identityRepository.findOne({
      where: {
        type: type,
        username: username,
        active: true,
        emailVerified: true,
      },
      relations: { role: true },
    });
  }

  public async getActivated(
    username: string,
    type: IdentityType,
  ): Promise<Identity> {
    if (username == undefined) return null;
    return this.identityRepository.findOne({
      where: {
        type: type,
        username: username,
        active: true,
        password: Not(IsNull()),
      },
      select: ['username', 'password', 'active', 'emailVerified', 'role', 'id'],
      relations: { role: true },
    });
  }

  public async getAdminForResetPassword(
    username: string,
    type: IdentityType,
  ): Promise<Identity> {
    if (username == undefined) return null;
    return this.identityRepository.findOne({
      where: {
        type: type,
        username: username,
        active: true,
      },
      select: ['username', 'password', 'active', 'emailVerified', 'role', 'id'],
      relations: { role: true },
    });
  }

  public async generateHashPassword(password: string): Promise<string> {
    const SALT_ROUND = 10;
    return bcrypt.hash(password, SALT_ROUND);
  }

  public async changePassword(
    userId,
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await this.identityRepository.findOne({
      where: {
        id: userId,
        active: true,
        password: Not(null),
      },
    });
    if (user && (await bcrypt.compare(oldPassword, user.password))) {
      user.password = await this.generateHashPassword(newPassword);
      await this.identityRepository.save(user);
      return true;
    }
    return false;
  }

  public async verify(id): Promise<Identity> {
    const identity = await this.identityRepository.findOne({
      where: { id },
      relations: { role: true },
    });
    identity.emailVerified = true;
    return this.identityRepository.save(identity);
  }

  public async registerUser(
    username: string,
    password: string | null,
    role: string,
    type: IdentityType,
    isVerified = false,
  ): Promise<Identity> {
    const roleObject = await this.roleService.getRole(role);
    const identity = await this.identityRepository.findOneBy({
      username: username,
      type: type,
      deletedAt:IsNull()
    });
    if (identity) throw new Error(IdentityError.DUPLICATE_EMAIL);
    const newIdentity = new Identity();
    newIdentity.username = username;
    newIdentity.password = password
      ? await this.generateHashPassword(password)
      : null;

    newIdentity.role = roleObject;
    newIdentity.type = type;
    newIdentity.emailVerified = isVerified;
    await this.identityRepository.save(newIdentity);
    return newIdentity;
  }

  public async resetPassword(
    id: number,
    newPassword: string,
  ): Promise<boolean> {
    const identity = await this.identityRepository.findOneBy({
      id,
      active: true,
    });
    identity.password = await this.generateHashPassword(newPassword);
    identity.emailVerified = true;
    await this.identityRepository.save(identity);
    return true;
  }

  public async setUserActivation(id: number, active: boolean): Promise<any> {
    return this.identityRepository.update(
      {
        id,
      },
      {
        active,
      },
    );
  }

  public async softDelete(id: number): Promise<any> {
    return this.identityRepository.softDelete({
      id,
    });
  }
}
