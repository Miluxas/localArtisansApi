import {
  
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { IdentityService } from '../../identity/identity.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly identityService: IdentityService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // call AuthGuard in order to ensure user is injected in request
    const baseGuardResult = await super.canActivate(context);
    if (!baseGuardResult) {
      // unsuccessful authentication return false
      return false;
    }
    const bearer: string = context.switchToHttp().getRequest()
      .headers?.authorization;
    const isTokenValid = await this.tokenValidate(bearer);
    if (!isTokenValid) return false;
    const { user, url, method } = context.switchToHttp().getRequest();
    return this.identityService.check(user.role ?? '', url, method);
  }

  public async tokenValidate(bearer: string): Promise<boolean> {
    if (!bearer) return;
    const token = this.getToken(bearer);
    if (!token) return true;
    const foundToken = await this.cacheManager.get(token);
    if (foundToken) return false;
    return true;
  }

  public getToken(bearer: string): string | void {
    if (!bearer) return;
    return bearer.split(' ')[1];
  }
}
