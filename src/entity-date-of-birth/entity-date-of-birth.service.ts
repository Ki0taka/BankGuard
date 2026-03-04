import { Injectable } from '@nestjs/common';
import { EntityDateOfBirthRepository } from './entity-date-of-birth.repository';
import { CreateEntityDateOfBirthDto } from './dto/create-entity-date-of-birth.dto';
import { UpdateEntityDateOfBirthDto } from './dto/update-entity-date-of-birth.dto';

@Injectable()
export class EntityDateOfBirthService {
  constructor(private readonly entityDateOfBirthRepository: EntityDateOfBirthRepository) {}

  create(createEntityDateOfBirthDto: CreateEntityDateOfBirthDto) {
    return 'This action adds a new entityDateOfBirth';
  }

  findAll() {
    return `This action returns all entityDateOfBirth`;
  }

  findOne(id: string) {
    return `This action returns a #entityDateOfBirth id`;
  }

  update(id: string, updateEntityDateOfBirthDto: UpdateEntityDateOfBirthDto) {
    return `This action updates a #entityDateOfBirth id`;
  }

  remove(id: string) {
    return `This action removes a #entityDateOfBirth id`;
  }
}
