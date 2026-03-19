import { Injectable, NotFoundException } from '@nestjs/common';
import { RequisitionRepository } from './requisition.repository';
import { CreateRequisitionDto } from './dto/create-requisition.dto';
import { UpdateRequisitionDto } from './dto/update-requisition.dto';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AuditActionEnum } from '../common/enums/audit-action.enum';

@Injectable()
export class RequisitionService {
  constructor(
    private readonly requisitionRepository: RequisitionRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(createRequisitionDto: CreateRequisitionDto) {
    const requisition = this.requisitionRepository.create(createRequisitionDto);
    const saved = await this.requisitionRepository.save(requisition);
    await this.auditLogService.log({
      action: AuditActionEnum.ENTITY_CREATED,
      entityType: 'Requisition',
      entityId: saved.id,
      metadata: { sanctionedEntityId: saved.sanctionedEntityId },
    });
    return saved;
  }

  findAll() {
    return this.requisitionRepository.find();
  }

  async findOne(id: string) {
    const requisition = await this.requisitionRepository.findOne({
      where: { id },
    });
    if (!requisition) {
      throw new NotFoundException('Requisition not found');
    }
    return requisition;
  }

  async update(id: string, updateRequisitionDto: UpdateRequisitionDto) {
    const requisition = await this.requisitionRepository.preload({
      id,
      ...updateRequisitionDto,
    });
    if (!requisition) {
      throw new NotFoundException('Requisition not found');
    }
    const saved = await this.requisitionRepository.save(requisition);
    await this.auditLogService.log({
      action: AuditActionEnum.ENTITY_UPDATED,
      entityType: 'Requisition',
      entityId: saved.id,
      metadata: updateRequisitionDto,
    });
    return saved;
  }

  async remove(id: string) {
    const requisition = await this.findOne(id);
    await this.requisitionRepository.remove(requisition);
    await this.auditLogService.log({
      action: AuditActionEnum.ENTITY_REMOVED,
      entityType: 'Requisition',
      entityId: requisition.id,
      metadata: { sanctionedEntityId: requisition.sanctionedEntityId },
    });
    return { deleted: true };
  }
}
