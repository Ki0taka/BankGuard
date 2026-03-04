import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EntityDateOfBirth } from './entities/entity-date-of-birth.entity';

@Injectable()
export class EntityDateOfBirthRepository extends Repository<EntityDateOfBirth> {
  constructor(private dataSource: DataSource) {
    super(EntityDateOfBirth, dataSource.createEntityManager());
  }
}
