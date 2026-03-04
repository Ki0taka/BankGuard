import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ExportJob } from './entities/export-job.entity';

@Injectable()
export class ExportJobRepository extends Repository<ExportJob> {
  constructor(private dataSource: DataSource) {
    super(ExportJob, dataSource.createEntityManager());
  }
}
