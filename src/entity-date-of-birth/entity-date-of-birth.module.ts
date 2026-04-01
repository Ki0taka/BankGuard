import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityDateOfBirthService } from './entity-date-of-birth.service';
import { EntityDateOfBirthController } from './entity-date-of-birth.controller';
import { EntityDateOfBirthRepository } from './entity-date-of-birth.repository';
import { EntityDateOfBirth } from './entities/entity-date-of-birth.entity';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([EntityDateOfBirth]), AuditLogModule],
  controllers: [EntityDateOfBirthController],
  providers: [EntityDateOfBirthService, EntityDateOfBirthRepository],
  exports: [EntityDateOfBirthService, EntityDateOfBirthRepository],
})
export class EntityDateOfBirthModule {}
