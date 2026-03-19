import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SanctionedEntityRepository } from './sanctioned-entity.repository';
import { CreateSanctionedEntityDto } from './dto/create-sanctioned-entity.dto';
import { UpdateSanctionedEntityDto } from './dto/update-sanctioned-entity.dto';
import { BlacklistStatusEnum } from '../common/enums/blacklist-status.enum';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AuditActionEnum } from '../common/enums/audit-action.enum';

@Injectable()
export class SanctionedEntityService {
  constructor(
    private readonly sanctionedEntityRepository: SanctionedEntityRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(createSanctionedEntityDto: CreateSanctionedEntityDto) {
    const entity = this.sanctionedEntityRepository.create(
      createSanctionedEntityDto,
    );
    const saved = await this.sanctionedEntityRepository.save(entity);
    await this.auditLogService.log({
      action: AuditActionEnum.SANCTIONED_ENTITY_CREATED,
      entityType: 'SanctionedEntity',
      entityId: saved.id,
      metadata: { status: saved.status },
    });
    return saved;
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
    const previousStatus = entity.status;
    const nextStatus = updateSanctionedEntityDto.status;
    if (nextStatus && nextStatus !== entity.status) {
      this.assertValidStatusTransition(entity.status, nextStatus);
    }
    Object.assign(entity, updateSanctionedEntityDto);
    const saved = await this.sanctionedEntityRepository.save(entity);
    if (nextStatus && nextStatus !== previousStatus) {
      await this.auditLogService.log({
        action: AuditActionEnum.SANCTIONED_ENTITY_STATUS_CHANGED,
        entityType: 'SanctionedEntity',
        entityId: saved.id,
        before: { status: previousStatus },
        after: { status: saved.status },
      });
    }
    return saved;
  }

  async remove(id: string) {
    const entity = await this.findOne(id);
    await this.sanctionedEntityRepository.remove(entity);
    await this.auditLogService.log({
      action: AuditActionEnum.SANCTIONED_ENTITY_REMOVED,
      entityType: 'SanctionedEntity',
      entityId: entity.id,
      metadata: { status: entity.status },
    });
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
      [BlacklistStatusEnum.PENDING]: [
        BlacklistStatusEnum.ACTIVE,
        BlacklistStatusEnum.REMOVED,
      ],
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
