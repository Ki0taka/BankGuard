import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityNameRepository } from './entity-name.repository';
import { CreateEntityNameDto } from './dto/create-entity-name.dto';
import { UpdateEntityNameDto } from './dto/update-entity-name.dto';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AuditActionEnum } from '../common/enums/audit-action.enum';

@Injectable()
export class EntityNameService {
  constructor(
    private readonly entityNameRepository: EntityNameRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(createEntityNameDto: CreateEntityNameDto) {
    const name = this.entityNameRepository.create(createEntityNameDto);
    const saved = await this.entityNameRepository.save(name);
    await this.auditLogService.log({
      action: AuditActionEnum.ENTITY_CREATED,
      entityType: 'EntityName',
      entityId: saved.id,
      metadata: { entityProfileId: saved.entityProfileId },
    });
    return saved;
  }

  findAll() {
    return this.entityNameRepository.find();
  }

  async findOne(id: string) {
    const name = await this.entityNameRepository.findOne({ where: { id } });
    if (!name) {
      throw new NotFoundException('Entity name not found');
    }
    return name;
  }

  async update(id: string, updateEntityNameDto: UpdateEntityNameDto) {
    const name = await this.entityNameRepository.preload({
      id,
      ...updateEntityNameDto,
    });
    if (!name) {
      throw new NotFoundException('Entity name not found');
    }
    const saved = await this.entityNameRepository.save(name);
    await this.auditLogService.log({
      action: AuditActionEnum.ENTITY_UPDATED,
      entityType: 'EntityName',
      entityId: saved.id,
      metadata: updateEntityNameDto as Record<string, unknown>,
    });
    return saved;
  }

  async remove(id: string) {
    const name = await this.findOne(id);
    await this.entityNameRepository.remove(name);
    await this.auditLogService.log({
      action: AuditActionEnum.ENTITY_REMOVED,
      entityType: 'EntityName',
      entityId: name.id,
      metadata: { entityProfileId: name.entityProfileId },
    });
    return { deleted: true };
  }
}
