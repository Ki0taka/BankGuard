import { Injectable } from '@nestjs/common';
import { SanctionedEntityRepository } from './sanctioned-entity.repository';
import { CreateSanctionedEntityDto } from './dto/create-sanctioned-entity.dto';
import { UpdateSanctionedEntityDto } from './dto/update-sanctioned-entity.dto';

@Injectable()
export class SanctionedEntityService {
  constructor(
    private readonly sanctionedEntityRepository: SanctionedEntityRepository,
  ) {}

  create(createSanctionedEntityDto: CreateSanctionedEntityDto) {
    return 'This action adds a new sanctionedEntity';
  }

  findAll() {
    return `This action returns all sanctionedEntity`;
  }

  findOne(id: string) {
    return `This action returns a #sanctionedEntity id`;
  }

  update(id: string, updateSanctionedEntityDto: UpdateSanctionedEntityDto) {
    return `This action updates a #sanctionedEntity id`;
  }

  remove(id: string) {
    return `This action removes a #sanctionedEntity id`;
  }
}
