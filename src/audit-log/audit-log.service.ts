import { Injectable } from '@nestjs/common';
import { AuditLogRepository } from './audit-log.repository';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';

@Injectable()
export class AuditLogService {
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  create(createAuditLogDto: CreateAuditLogDto) {
    const log = this.auditLogRepository.create(createAuditLogDto);
    return this.auditLogRepository.save(log);
  }

  findAll() {
    return this.auditLogRepository.find({ order: { createdAt: 'DESC' } });
  }

  findOne(id: string) {
    return this.auditLogRepository.findOne({ where: { id } });
  }

  update(id: string, updateAuditLogDto: UpdateAuditLogDto) {
    return this.auditLogRepository.save({ id, ...updateAuditLogDto });
  }

  remove(id: string) {
    return this.auditLogRepository.delete(id);
  }

  log(entry: CreateAuditLogDto) {
    return this.create(entry);
  }
}
