import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncedEntityService } from './synced-entity.service';
import { SyncedEntityController } from './synced-entity.controller';
import { SyncedEntityRepository } from './synced-entity.repository';
import { SyncedEntity } from './entities/synced-entity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SyncedEntity])],
  controllers: [SyncedEntityController],
  providers: [SyncedEntityService, SyncedEntityRepository],
  exports: [SyncedEntityService, SyncedEntityRepository],
})
export class SyncedEntityModule {}
