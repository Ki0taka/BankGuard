import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VesselProfileService } from './vessel-profile.service';
import { VesselProfileController } from './vessel-profile.controller';
import { VesselProfileRepository } from './vessel-profile.repository';
import { VesselProfile } from './entities/vessel-profile.entity';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([VesselProfile]), AuditLogModule],
  controllers: [VesselProfileController],
  providers: [VesselProfileService, VesselProfileRepository],
  exports: [VesselProfileService, VesselProfileRepository],
})
export class VesselProfileModule {}
