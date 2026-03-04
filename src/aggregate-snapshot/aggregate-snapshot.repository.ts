import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AggregateSnapshot } from './entities/aggregate-snapshot.entity';

@Injectable()
export class AggregateSnapshotRepository extends Repository<AggregateSnapshot> {
  constructor(private dataSource: DataSource) {
    super(AggregateSnapshot, dataSource.createEntityManager());
  }
}
