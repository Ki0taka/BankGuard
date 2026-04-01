import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityStatusService } from './entity-status.service';
import { EntityStatusController } from './entity-status.controller';
import { EntityStatusRepository } from './entity-status.repository';
import { EntityStatus } from './entities/entity-status.entity';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([EntityStatus]), AuditLogModule],
  controllers: [EntityStatusController],
  providers: [EntityStatusService, EntityStatusRepository],
  exports: [EntityStatusService, EntityStatusRepository],
})
export class EntityStatusModule {}
