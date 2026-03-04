import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityAddressService } from './entity-address.service';
import { EntityAddressController } from './entity-address.controller';
import { EntityAddressRepository } from './entity-address.repository';
import { EntityAddress } from './entities/entity-address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityAddress])],
  controllers: [EntityAddressController],
  providers: [EntityAddressService, EntityAddressRepository],
  exports: [EntityAddressService, EntityAddressRepository],
})
export class EntityAddressModule {}
