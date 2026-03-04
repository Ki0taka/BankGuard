import { Injectable } from '@nestjs/common';
import { EvidenceDocumentRepository } from './evidence-document.repository';
import { CreateEvidenceDocumentDto } from './dto/create-evidence-document.dto';
import { UpdateEvidenceDocumentDto } from './dto/update-evidence-document.dto';

@Injectable()
export class EvidenceDocumentService {
  constructor(private readonly evidenceDocumentRepository: EvidenceDocumentRepository) {}

  create(createEvidenceDocumentDto: CreateEvidenceDocumentDto) {
    return 'This action adds a new evidenceDocument';
  }

  findAll() {
    return `This action returns all evidenceDocument`;
  }

  findOne(id: string) {
    return `This action returns a #evidenceDocument id`;
  }

  update(id: string, updateEvidenceDocumentDto: UpdateEvidenceDocumentDto) {
    return `This action updates a #evidenceDocument id`;
  }

  remove(id: string) {
    return `This action removes a #evidenceDocument id`;
  }
}
