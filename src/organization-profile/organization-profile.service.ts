import { Injectable } from '@nestjs/common';
import { OrganizationProfileRepository } from './organization-profile.repository';
import { CreateOrganizationProfileDto } from './dto/create-organization-profile.dto';
import { UpdateOrganizationProfileDto } from './dto/update-organization-profile.dto';

@Injectable()
export class OrganizationProfileService {
  constructor(private readonly organizationProfileRepository: OrganizationProfileRepository) {}

  create(createOrganizationProfileDto: CreateOrganizationProfileDto) {
    return 'This action adds a new organizationProfile';
  }

  findAll() {
    return `This action returns all organizationProfile`;
  }

  findOne(id: string) {
    return `This action returns a #organizationProfile id`;
  }

  update(id: string, updateOrganizationProfileDto: UpdateOrganizationProfileDto) {
    return `This action updates a #organizationProfile id`;
  }

  remove(id: string) {
    return `This action removes a #organizationProfile id`;
  }
}
