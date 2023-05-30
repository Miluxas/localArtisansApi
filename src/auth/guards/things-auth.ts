import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  
  ExecutionContext,
  Inject,
  Injectable
} from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()
export class ThingsAuthGuard {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = context.switchToWs().getClient().handshake.headers.token;
    if (!token) return false;
    const public_key = await this.cacheManager.get<String>(`socket:${token}`);
    if (!public_key) return false;
    return true;
  }
}
