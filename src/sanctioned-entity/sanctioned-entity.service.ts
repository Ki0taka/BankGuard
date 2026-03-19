import { Injectable, NotFoundException } from '@nestjs/common';
import { SanctionedEntityRepository } from './sanctioned-entity.repository';
import { CreateSanctionedEntityDto } from './dto/create-sanctioned-entity.dto';
import { UpdateSanctionedEntityDto } from './dto/update-sanctioned-entity.dto';

@Injectable()
export class SanctionedEntityService {
  constructor(
    private readonly sanctionedEntityRepository: SanctionedEntityRepository,
  ) {}

  create(createSanctionedEntityDto: CreateSanctionedEntityDto) {
    const entity = this.sanctionedEntityRepository.create(
      createSanctionedEntityDto,
    );
    return this.sanctionedEntityRepository.save(entity);
  }

  findAll() {
    return this.sanctionedEntityRepository.find();
  }

  async findOne(id: string) {
    const entity = await this.sanctionedEntityRepository.findOne({
      where: { id },
    });
    if (!entity) {
      throw new NotFoundException('Sanctioned entity not found');
    }
    return entity;
  }

  async update(id: string, updateSanctionedEntityDto: UpdateSanctionedEntityDto) {
    const entity = await this.sanctionedEntityRepository.preload({
      id,
      ...updateSanctionedEntityDto,
    });
    if (!entity) {
      throw new NotFoundException('Sanctioned entity not found');
    }
    return this.sanctionedEntityRepository.save(entity);
  }

  async remove(id: string) {
    const entity = await this.findOne(id);
    await this.sanctionedEntityRepository.remove(entity);
    return { deleted: true };
  }
}
