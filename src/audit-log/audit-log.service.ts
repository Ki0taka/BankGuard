import { Injectable } from '@nestjs/common';
import { AuditLogRepository } from './audit-log.repository';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';

@Injectable()
export class AuditLogService {
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  create(createAuditLogDto: CreateAuditLogDto) {
    return 'This action adds a new auditLog';
  }

  findAll() {
    return `This action returns all auditLog`;
  }

  findOne(id: string) {
    return `This action returns a #auditLog id`;
  }

  update(id: string, updateAuditLogDto: UpdateAuditLogDto) {
    return `This action updates a #auditLog id`;
  }

  remove(id: string) {
    return `This action removes a #auditLog id`;
  }
}
