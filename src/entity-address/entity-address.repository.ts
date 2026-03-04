import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EntityAddress } from './entities/entity-address.entity';

@Injectable()
export class EntityAddressRepository extends Repository<EntityAddress> {
  constructor(private dataSource: DataSource) {
    super(EntityAddress, dataSource.createEntityManager());
  }
}
