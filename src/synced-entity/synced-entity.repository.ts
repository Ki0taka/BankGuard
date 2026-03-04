import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SyncedEntity } from './entities/synced-entity.entity';

@Injectable()
export class SyncedEntityRepository extends Repository<SyncedEntity> {
  constructor(private dataSource: DataSource) {
    super(SyncedEntity, dataSource.createEntityManager());
  }
}
