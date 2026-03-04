import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ExportRow } from './entities/export-row.entity';

@Injectable()
export class ExportRowRepository extends Repository<ExportRow> {
  constructor(private dataSource: DataSource) {
    super(ExportRow, dataSource.createEntityManager());
  }
}
