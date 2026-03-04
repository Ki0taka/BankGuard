import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SyncRun } from './entities/sync-run.entity';

@Injectable()
export class SyncRunRepository extends Repository<SyncRun> {
  constructor(private dataSource: DataSource) {
    super(SyncRun, dataSource.createEntityManager());
  }
}
