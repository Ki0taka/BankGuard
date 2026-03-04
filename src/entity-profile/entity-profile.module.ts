import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityProfileService } from './entity-profile.service';
import { EntityProfileController } from './entity-profile.controller';
import { EntityProfileRepository } from './entity-profile.repository';
import { EntityProfile } from './entities/entity-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityProfile])],
  controllers: [EntityProfileController],
  providers: [EntityProfileService, EntityProfileRepository],
  exports: [EntityProfileService, EntityProfileRepository],
})
export class EntityProfileModule {}
