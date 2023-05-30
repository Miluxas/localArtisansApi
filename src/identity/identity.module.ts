import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorHandlerModule } from '../error-handler/error-handler.module';
import { Identity } from './entities/identity.entity';
import { identityErrorMessages } from './identity.error';
import { IdentityService } from './identity.service';
import { PermissionModule } from './permission.module';
import { RoleModule } from './role.module';
@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Identity]),
    RoleModule,
    PermissionModule,
    ConfigModule.forRoot(),
    ErrorHandlerModule.register(identityErrorMessages),
  ],
  providers: [IdentityService],
  exports: [IdentityService],
})
export class IdentityModule {}
