import { Injectable } from '@nestjs/common';
import { EntityStatusRepository } from './entity-status.repository';
import { CreateEntityStatusDto } from './dto/create-entity-status.dto';
import { UpdateEntityStatusDto } from './dto/update-entity-status.dto';

@Injectable()
export class EntityStatusService {
  constructor(
    private readonly entityStatusRepository: EntityStatusRepository,
  ) {}

  create(createEntityStatusDto: CreateEntityStatusDto) {
    return 'This action adds a new entityStatus';
  }

  findAll() {
    return `This action returns all entityStatus`;
  }

  findOne(id: string) {
    return `This action returns a #entityStatus id`;
  }

  update(id: string, updateEntityStatusDto: UpdateEntityStatusDto) {
    return `This action updates a #entityStatus id`;
  }

  remove(id: string) {
    return `This action removes a #entityStatus id`;
  }
}
