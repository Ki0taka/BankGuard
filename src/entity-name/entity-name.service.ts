import { Injectable } from '@nestjs/common';
import { EntityNameRepository } from './entity-name.repository';
import { CreateEntityNameDto } from './dto/create-entity-name.dto';
import { UpdateEntityNameDto } from './dto/update-entity-name.dto';

@Injectable()
export class EntityNameService {
  constructor(private readonly entityNameRepository: EntityNameRepository) {}

  create(createEntityNameDto: CreateEntityNameDto) {
    return 'This action adds a new entityName';
  }

  findAll() {
    return `This action returns all entityName`;
  }

  findOne(id: string) {
    return `This action returns a #entityName id`;
  }

  update(id: string, updateEntityNameDto: UpdateEntityNameDto) {
    return `This action updates a #entityName id`;
  }

  remove(id: string) {
    return `This action removes a #entityName id`;
  }
}
