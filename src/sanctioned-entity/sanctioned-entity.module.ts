import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SanctionedEntityService } from './sanctioned-entity.service';
import { SanctionedEntityController } from './sanctioned-entity.controller';
import { SanctionedEntityRepository } from './sanctioned-entity.repository';
import { SanctionedEntity } from './entities/sanctioned-entity.entity';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { EntityProfileModule } from '../entity-profile/entity-profile.module';
import { EntityProfile } from '../entity-profile/entities/entity-profile.entity';
import { EntityName } from '../entity-name/entities/entity-name.entity';
import { EntityAddress } from '../entity-address/entities/entity-address.entity';
import { EntityDateOfBirth } from '../entity-date-of-birth/entities/entity-date-of-birth.entity';
import { IndividualProfile } from '../individual-profile/entities/individual-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SanctionedEntity,
      EntityProfile,
      EntityName,
      EntityAddress,
      EntityDateOfBirth,
      IndividualProfile,
    ]),
    AuditLogModule,
    EntityProfileModule,
  ],
  controllers: [SanctionedEntityController],
  providers: [SanctionedEntityService, SanctionedEntityRepository],
  exports: [SanctionedEntityService, SanctionedEntityRepository],
})
export class SanctionedEntityModule {}
