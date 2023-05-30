import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './entities/activity-log.entity';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly timelineRepository: Repository<ActivityLog>,
  ) {}

  public log(activity) {
    this.timelineRepository.insert(activity).catch(console.error);
  }
}
