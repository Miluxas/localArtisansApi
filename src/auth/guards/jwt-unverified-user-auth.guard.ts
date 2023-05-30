import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtUnverifiedUserAuthGuard {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const bearer: string = context.switchToHttp().getRequest()
      .headers?.authorization;
    const verify = this.authService.verifyBearer(bearer);
    if (!verify) return false;
    return true;
  }
}
