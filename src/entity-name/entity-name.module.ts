import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityNameService } from './entity-name.service';
import { EntityNameController } from './entity-name.controller';
import { EntityNameRepository } from './entity-name.repository';
import { EntityName } from './entities/entity-name.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityName])],
  controllers: [EntityNameController],
  providers: [EntityNameService, EntityNameRepository],
  exports: [EntityNameService, EntityNameRepository],
})
export class EntityNameModule {}
