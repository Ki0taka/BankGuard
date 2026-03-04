import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncRunService } from './sync-run.service';
import { SyncRunController } from './sync-run.controller';
import { SyncRunRepository } from './sync-run.repository';
import { SyncRun } from './entities/sync-run.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SyncRun])],
  controllers: [SyncRunController],
  providers: [SyncRunService, SyncRunRepository],
  exports: [SyncRunService, SyncRunRepository],
})
export class SyncRunModule {}
