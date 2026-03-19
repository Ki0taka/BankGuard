import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityProfileService } from './entity-profile.service';
import { EntityProfileController } from './entity-profile.controller';
import { EntityProfileRepository } from './entity-profile.repository';
import { EntityProfile } from './entities/entity-profile.entity';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([EntityProfile]), AuditLogModule],
  controllers: [EntityProfileController],
  providers: [EntityProfileService, EntityProfileRepository],
  exports: [EntityProfileService, EntityProfileRepository],
})
export class EntityProfileModule {}
