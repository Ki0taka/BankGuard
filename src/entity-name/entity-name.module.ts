import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityNameService } from './entity-name.service';
import { EntityNameController } from './entity-name.controller';
import { EntityNameRepository } from './entity-name.repository';
import { EntityName } from './entities/entity-name.entity';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([EntityName]), AuditLogModule],
  controllers: [EntityNameController],
  providers: [EntityNameService, EntityNameRepository],
  exports: [EntityNameService, EntityNameRepository],
})
export class EntityNameModule {}
