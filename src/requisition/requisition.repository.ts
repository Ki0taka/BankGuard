import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Requisition } from './entities/requisition.entity';

@Injectable()
export class RequisitionRepository extends Repository<Requisition> {
  constructor(private dataSource: DataSource) {
    super(Requisition, dataSource.createEntityManager());
  }
}
