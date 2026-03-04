import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ExternalSource } from './entities/external-source.entity';

@Injectable()
export class ExternalSourceRepository extends Repository<ExternalSource> {
  constructor(private dataSource: DataSource) {
    super(ExternalSource, dataSource.createEntityManager());
  }
}
