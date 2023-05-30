import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorHandlerModule } from '../error-handler/error-handler.module';
import { activityLogErrorMessages } from './activity-log.error';
import { ActivityLogService } from './activity-log.service';
import { ActivityLog } from './entities/activity-log.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([ActivityLog]),
    ConfigModule,
    ErrorHandlerModule.register(activityLogErrorMessages),
  ],
  providers: [ActivityLogService],
  exports: [ActivityLogService],
})
export class ActivityLogModule {}
