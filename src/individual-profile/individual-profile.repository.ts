import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { IndividualProfile } from './entities/individual-profile.entity';

@Injectable()
export class IndividualProfileRepository extends Repository<IndividualProfile> {
  constructor(private dataSource: DataSource) {
    super(IndividualProfile, dataSource.createEntityManager());
  }
}
