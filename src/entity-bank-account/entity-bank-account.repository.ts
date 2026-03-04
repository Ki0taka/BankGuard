import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EntityBankAccount } from './entities/entity-bank-account.entity';

@Injectable()
export class EntityBankAccountRepository extends Repository<EntityBankAccount> {
  constructor(private dataSource: DataSource) {
    super(EntityBankAccount, dataSource.createEntityManager());
  }
}
