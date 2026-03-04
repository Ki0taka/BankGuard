import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportRowService } from './export-row.service';
import { ExportRowController } from './export-row.controller';
import { ExportRowRepository } from './export-row.repository';
import { ExportRow } from './entities/export-row.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExportRow])],
  controllers: [ExportRowController],
  providers: [ExportRowService, ExportRowRepository],
  exports: [ExportRowService, ExportRowRepository],
})
export class ExportRowModule {}
