import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SanctionedEntityService } from './sanctioned-entity.service';
import { SanctionedEntityController } from './sanctioned-entity.controller';
import { SanctionedEntityRepository } from './sanctioned-entity.repository';
import { SanctionedEntity } from './entities/sanctioned-entity.entity';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([SanctionedEntity]), AuditLogModule],
  controllers: [SanctionedEntityController],
  providers: [SanctionedEntityService, SanctionedEntityRepository],
  exports: [SanctionedEntityService, SanctionedEntityRepository],
})
export class SanctionedEntityModule {}
