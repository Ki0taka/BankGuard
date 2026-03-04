import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EntityProfile } from './entities/entity-profile.entity';

@Injectable()
export class EntityProfileRepository extends Repository<EntityProfile> {
  constructor(private dataSource: DataSource) {
    super(EntityProfile, dataSource.createEntityManager());
  }
}
