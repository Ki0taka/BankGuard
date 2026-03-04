import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityDateOfBirthService } from './entity-date-of-birth.service';
import { EntityDateOfBirthController } from './entity-date-of-birth.controller';
import { EntityDateOfBirthRepository } from './entity-date-of-birth.repository';
import { EntityDateOfBirth } from './entities/entity-date-of-birth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityDateOfBirth])],
  controllers: [EntityDateOfBirthController],
  providers: [EntityDateOfBirthService, EntityDateOfBirthRepository],
  exports: [EntityDateOfBirthService, EntityDateOfBirthRepository],
})
export class EntityDateOfBirthModule {}
