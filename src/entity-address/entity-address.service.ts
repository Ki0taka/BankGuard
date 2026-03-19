import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityAddressRepository } from './entity-address.repository';
import { CreateEntityAddressDto } from './dto/create-entity-address.dto';
import { UpdateEntityAddressDto } from './dto/update-entity-address.dto';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AuditActionEnum } from '../common/enums/audit-action.enum';

@Injectable()
export class EntityAddressService {
  constructor(
    private readonly entityAddressRepository: EntityAddressRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(createEntityAddressDto: CreateEntityAddressDto) {
    const address = this.entityAddressRepository.create(createEntityAddressDto);
    const saved = await this.entityAddressRepository.save(address);
    await this.auditLogService.log({
      action: AuditActionEnum.ENTITY_CREATED,
      entityType: 'EntityAddress',
      entityId: saved.id,
      metadata: { entityProfileId: saved.entityProfileId },
    });
    return saved;
  }

  findAll() {
    return this.entityAddressRepository.find();
  }

  async findOne(id: string) {
    const address = await this.entityAddressRepository.findOne({
      where: { id },
    });
    if (!address) {
      throw new NotFoundException('Entity address not found');
    }
    return address;
  }

  async update(id: string, updateEntityAddressDto: UpdateEntityAddressDto) {
    const address = await this.entityAddressRepository.preload({
      id,
      ...updateEntityAddressDto,
    });
    if (!address) {
      throw new NotFoundException('Entity address not found');
    }
    const saved = await this.entityAddressRepository.save(address);
    await this.auditLogService.log({
      action: AuditActionEnum.ENTITY_UPDATED,
      entityType: 'EntityAddress',
      entityId: saved.id,
      metadata: updateEntityAddressDto,
    });
    return saved;
  }

  async remove(id: string) {
    const address = await this.findOne(id);
    await this.entityAddressRepository.remove(address);
    await this.auditLogService.log({
      action: AuditActionEnum.ENTITY_REMOVED,
      entityType: 'EntityAddress',
      entityId: address.id,
      metadata: { entityProfileId: address.entityProfileId },
    });
    return { deleted: true };
  }
}
