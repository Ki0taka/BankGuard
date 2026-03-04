import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SanctionedEntity } from './entities/sanctioned-entity.entity';

@Injectable()
export class SanctionedEntityRepository extends Repository<SanctionedEntity> {
  constructor(private dataSource: DataSource) {
    super(SanctionedEntity, dataSource.createEntityManager());
  }
}
