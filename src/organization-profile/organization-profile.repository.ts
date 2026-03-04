import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OrganizationProfile } from './entities/organization-profile.entity';

@Injectable()
export class OrganizationProfileRepository extends Repository<OrganizationProfile> {
  constructor(private dataSource: DataSource) {
    super(OrganizationProfile, dataSource.createEntityManager());
  }
}
