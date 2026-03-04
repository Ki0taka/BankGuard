import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SanctionedEntityService } from './sanctioned-entity.service';
import { SanctionedEntityController } from './sanctioned-entity.controller';
import { SanctionedEntityRepository } from './sanctioned-entity.repository';
import { SanctionedEntity } from './entities/sanctioned-entity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SanctionedEntity])],
  controllers: [SanctionedEntityController],
  providers: [SanctionedEntityService, SanctionedEntityRepository],
  exports: [SanctionedEntityService, SanctionedEntityRepository],
})
export class SanctionedEntityModule {}
