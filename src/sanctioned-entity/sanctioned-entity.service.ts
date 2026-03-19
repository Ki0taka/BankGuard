import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SanctionedEntityRepository } from './sanctioned-entity.repository';
import { CreateSanctionedEntityDto } from './dto/create-sanctioned-entity.dto';
import { UpdateSanctionedEntityDto } from './dto/update-sanctioned-entity.dto';
import { BlacklistStatusEnum } from '../common/enums/blacklist-status.enum';

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
    const entity = await this.findOne(id);
    const nextStatus = updateSanctionedEntityDto.status;
    if (nextStatus && nextStatus !== entity.status) {
      this.assertValidStatusTransition(entity.status, nextStatus);
    }
    Object.assign(entity, updateSanctionedEntityDto);
    return this.sanctionedEntityRepository.save(entity);
  }

  async remove(id: string) {
    const entity = await this.findOne(id);
    await this.sanctionedEntityRepository.remove(entity);
    return { deleted: true };
  }

  private assertValidStatusTransition(
    current: BlacklistStatusEnum,
    next: BlacklistStatusEnum,
  ) {
    const allowedTransitions: Record<
      BlacklistStatusEnum,
      BlacklistStatusEnum[]
    > = {
      [BlacklistStatusEnum.PENDING]: [BlacklistStatusEnum.ACTIVE],
      [BlacklistStatusEnum.ACTIVE]: [BlacklistStatusEnum.REMOVED],
      [BlacklistStatusEnum.REMOVED]: [],
    };

    const allowed = allowedTransitions[current] || [];
    if (!allowed.includes(next)) {
      throw new BadRequestException(
        `Invalid status transition: ${current} -> ${next}`,
      );
    }
  }
}
