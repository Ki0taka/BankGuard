import { Injectable } from '@nestjs/common';
import { EntityAddressRepository } from './entity-address.repository';
import { CreateEntityAddressDto } from './dto/create-entity-address.dto';
import { UpdateEntityAddressDto } from './dto/update-entity-address.dto';

@Injectable()
export class EntityAddressService {
  constructor(
    private readonly entityAddressRepository: EntityAddressRepository,
  ) {}

  create(createEntityAddressDto: CreateEntityAddressDto) {
    return 'This action adds a new entityAddress';
  }

  findAll() {
    return `This action returns all entityAddress`;
  }

  findOne(id: string) {
    return `This action returns a #entityAddress id`;
  }

  update(id: string, updateEntityAddressDto: UpdateEntityAddressDto) {
    return `This action updates a #entityAddress id`;
  }

  remove(id: string) {
    return `This action removes a #entityAddress id`;
  }
}
