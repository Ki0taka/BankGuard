import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EntityStatus } from './entities/entity-status.entity';

@Injectable()
export class EntityStatusRepository extends Repository<EntityStatus> {
  constructor(private dataSource: DataSource) {
    super(EntityStatus, dataSource.createEntityManager());
  }
}
