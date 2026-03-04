import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationProfileService } from './organization-profile.service';
import { OrganizationProfileController } from './organization-profile.controller';
import { OrganizationProfileRepository } from './organization-profile.repository';
import { OrganizationProfile } from './entities/organization-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationProfile])],
  controllers: [OrganizationProfileController],
  providers: [OrganizationProfileService, OrganizationProfileRepository],
  exports: [OrganizationProfileService, OrganizationProfileRepository],
})
export class OrganizationProfileModule {}
