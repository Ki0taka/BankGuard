import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndividualProfileService } from './individual-profile.service';
import { IndividualProfileController } from './individual-profile.controller';
import { IndividualProfileRepository } from './individual-profile.repository';
import { IndividualProfile } from './entities/individual-profile.entity';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([IndividualProfile]), AuditLogModule],
  controllers: [IndividualProfileController],
  providers: [IndividualProfileService, IndividualProfileRepository],
  exports: [IndividualProfileService, IndividualProfileRepository],
})
export class IndividualProfileModule {}
