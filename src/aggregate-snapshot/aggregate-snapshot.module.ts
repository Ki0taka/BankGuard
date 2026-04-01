import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AggregateSnapshotService } from './aggregate-snapshot.service';
import { AggregateSnapshotController } from './aggregate-snapshot.controller';
import { AggregateSnapshotRepository } from './aggregate-snapshot.repository';
import { AggregateSnapshot } from './entities/aggregate-snapshot.entity';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([AggregateSnapshot]), AuditLogModule],
  controllers: [AggregateSnapshotController],
  providers: [AggregateSnapshotService, AggregateSnapshotRepository],
  exports: [AggregateSnapshotService, AggregateSnapshotRepository],
})
export class AggregateSnapshotModule {}
