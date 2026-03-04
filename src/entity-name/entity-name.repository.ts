import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EntityName } from './entities/entity-name.entity';

@Injectable()
export class EntityNameRepository extends Repository<EntityName> {
  constructor(private dataSource: DataSource) {
    super(EntityName, dataSource.createEntityManager());
  }
}
