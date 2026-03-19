import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityProfileRepository } from './entity-profile.repository';
import { CreateEntityProfileDto } from './dto/create-entity-profile.dto';
import { UpdateEntityProfileDto } from './dto/update-entity-profile.dto';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AuditActionEnum } from '../common/enums/audit-action.enum';

@Injectable()
export class EntityProfileService {
  constructor(
    private readonly entityProfileRepository: EntityProfileRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(createEntityProfileDto: CreateEntityProfileDto) {
    const profile = this.entityProfileRepository.create(createEntityProfileDto);
    const saved = await this.entityProfileRepository.save(profile);
    await this.auditLogService.log({
      action: AuditActionEnum.ENTITY_CREATED,
      entityType: 'EntityProfile',
      entityId: saved.id,
      metadata: { sanctionedEntityId: saved.sanctionedEntityId },
    });
    return saved;
  }

  findAll() {
    return this.entityProfileRepository.find();
  }

  async findOne(id: string) {
    const profile = await this.entityProfileRepository.findOne({
      where: { id },
    });
    if (!profile) {
      throw new NotFoundException('Entity profile not found');
    }
    return profile;
  }

  async update(id: string, updateEntityProfileDto: UpdateEntityProfileDto) {
    const profile = await this.entityProfileRepository.preload({
      id,
      ...updateEntityProfileDto,
    });
    if (!profile) {
      throw new NotFoundException('Entity profile not found');
    }
    const saved = await this.entityProfileRepository.save(profile);
    await this.auditLogService.log({
      action: AuditActionEnum.ENTITY_UPDATED,
      entityType: 'EntityProfile',
      entityId: saved.id,
      metadata: updateEntityProfileDto,
    });
    return saved;
  }

  async remove(id: string) {
    const profile = await this.findOne(id);
    await this.entityProfileRepository.remove(profile);
    await this.auditLogService.log({
      action: AuditActionEnum.ENTITY_REMOVED,
      entityType: 'EntityProfile',
      entityId: profile.id,
      metadata: { sanctionedEntityId: profile.sanctionedEntityId },
    });
    return { deleted: true };
  }
}
