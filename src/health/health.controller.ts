import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('/health')
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private memoryHealthIndicator: MemoryHealthIndicator,
    private typeOrmHealthIndicator: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthCheckService.check([
      () =>
        this.memoryHealthIndicator.checkHeap('memory heap', 300 * 1024 * 1024),
      () =>
        this.memoryHealthIndicator.checkRSS('memory RSS', 300 * 1024 * 1024),
      () =>
        this.typeOrmHealthIndicator.pingCheck('database', { timeout: 1500 }),
    ]);
  }
}
