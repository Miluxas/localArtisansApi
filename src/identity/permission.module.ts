import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionService } from './permission.service';
import { RoleModule } from './role.module';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), RoleModule],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
