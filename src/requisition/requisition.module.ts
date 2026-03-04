import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequisitionService } from './requisition.service';
import { RequisitionController } from './requisition.controller';
import { RequisitionRepository } from './requisition.repository';
import { Requisition } from './entities/requisition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Requisition])],
  controllers: [RequisitionController],
  providers: [RequisitionService, RequisitionRepository],
  exports: [RequisitionService, RequisitionRepository],
})
export class RequisitionModule {}
