import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequisitionService } from './requisition.service';
import { RequisitionController } from './requisition.controller';
import { RequisitionRepository } from './requisition.repository';
import { Requisition } from './entities/requisition.entity';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([Requisition]), AuditLogModule],
  controllers: [RequisitionController],
  providers: [RequisitionService, RequisitionRepository],
  exports: [RequisitionService, RequisitionRepository],
})
export class RequisitionModule {}
