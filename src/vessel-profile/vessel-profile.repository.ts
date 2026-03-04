import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { VesselProfile } from './entities/vessel-profile.entity';

@Injectable()
export class VesselProfileRepository extends Repository<VesselProfile> {
  constructor(private dataSource: DataSource) {
    super(VesselProfile, dataSource.createEntityManager());
  }
}
