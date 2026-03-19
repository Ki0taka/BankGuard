import { Injectable, NotFoundException } from '@nestjs/common';
import { EvidenceDocumentRepository } from './evidence-document.repository';
import { CreateEvidenceDocumentDto } from './dto/create-evidence-document.dto';
import { UpdateEvidenceDocumentDto } from './dto/update-evidence-document.dto';

@Injectable()
export class EvidenceDocumentService {
  constructor(
    private readonly evidenceDocumentRepository: EvidenceDocumentRepository,
  ) {}

  create(createEvidenceDocumentDto: CreateEvidenceDocumentDto) {
    const document =
      this.evidenceDocumentRepository.create(createEvidenceDocumentDto);
    return this.evidenceDocumentRepository.save(document);
  }

  findAll() {
    return this.evidenceDocumentRepository.find();
  }

  async findOne(id: string) {
    const document = await this.evidenceDocumentRepository.findOne({
      where: { id },
    });
    if (!document) {
      throw new NotFoundException('Evidence document not found');
    }
    return document;
  }

  async update(id: string, updateEvidenceDocumentDto: UpdateEvidenceDocumentDto) {
    const document = await this.evidenceDocumentRepository.preload({
      id,
      ...updateEvidenceDocumentDto,
    });
    if (!document) {
      throw new NotFoundException('Evidence document not found');
    }
    return this.evidenceDocumentRepository.save(document);
  }

  async remove(id: string) {
    const document = await this.findOne(id);
    await this.evidenceDocumentRepository.remove(document);
    return { deleted: true };
  }
}
