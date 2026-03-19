import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityStatusRepository } from './entity-status.repository';
import { CreateEntityStatusDto } from './dto/create-entity-status.dto';
import { UpdateEntityStatusDto } from './dto/update-entity-status.dto';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AuditActionEnum } from '../common/enums/audit-action.enum';

@Injectable()
export class EntityStatusService {
  constructor(
    private readonly entityStatusRepository: EntityStatusRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(createEntityStatusDto: CreateEntityStatusDto) {
    const status = this.entityStatusRepository.create(createEntityStatusDto);
    const saved = await this.entityStatusRepository.save(status);
    await this.auditLogService.log({
      action: AuditActionEnum.ENTITY_CREATED,
      entityType: 'EntityStatus',
      entityId: saved.id,
      metadata: { entityProfileId: saved.entityProfileId },
    });
    return saved;
  }

  findAll() {
    return this.entityStatusRepository.find();
  }

  async findOne(id: string) {
    const status = await this.entityStatusRepository.findOne({
      where: { id },
    });
    if (!status) {
      throw new NotFoundException('Entity status not found');
    }
    return status;
  }

  async update(id: string, updateEntityStatusDto: UpdateEntityStatusDto) {
    const status = await this.entityStatusRepository.preload({
      id,
      ...updateEntityStatusDto,
    });
    if (!status) {
      throw new NotFoundException('Entity status not found');
    }
    const saved = await this.entityStatusRepository.save(status);
    await this.auditLogService.log({
      action: AuditActionEnum.ENTITY_UPDATED,
      entityType: 'EntityStatus',
      entityId: saved.id,
      metadata: updateEntityStatusDto,
    });
    return saved;
  }

  async remove(id: string) {
    const status = await this.findOne(id);
    await this.entityStatusRepository.remove(status);
    await this.auditLogService.log({
      action: AuditActionEnum.ENTITY_REMOVED,
      entityType: 'EntityStatus',
      entityId: status.id,
      metadata: { entityProfileId: status.entityProfileId },
    });
    return { deleted: true };
  }
}
