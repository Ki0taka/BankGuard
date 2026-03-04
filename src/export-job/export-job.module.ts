import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportJobService } from './export-job.service';
import { ExportJobController } from './export-job.controller';
import { ExportJobRepository } from './export-job.repository';
import { ExportJob } from './entities/export-job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExportJob])],
  controllers: [ExportJobController],
  providers: [ExportJobService, ExportJobRepository],
  exports: [ExportJobService, ExportJobRepository],
})
export class ExportJobModule {}
