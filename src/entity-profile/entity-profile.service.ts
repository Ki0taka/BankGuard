import { Injectable } from '@nestjs/common';
import { EntityProfileRepository } from './entity-profile.repository';
import { CreateEntityProfileDto } from './dto/create-entity-profile.dto';
import { UpdateEntityProfileDto } from './dto/update-entity-profile.dto';

@Injectable()
export class EntityProfileService {
  constructor(
    private readonly entityProfileRepository: EntityProfileRepository,
  ) {}

  create(createEntityProfileDto: CreateEntityProfileDto) {
    return 'This action adds a new entityProfile';
  }

  findAll() {
    return `This action returns all entityProfile`;
  }

  findOne(id: string) {
    return `This action returns a #entityProfile id`;
  }

  update(id: string, updateEntityProfileDto: UpdateEntityProfileDto) {
    return `This action updates a #entityProfile id`;
  }

  remove(id: string) {
    return `This action removes a #entityProfile id`;
  }
}
