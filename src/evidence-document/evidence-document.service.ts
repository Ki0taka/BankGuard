import { Injectable, NotFoundException } from '@nestjs/common';
import { EvidenceDocumentRepository } from './evidence-document.repository';
import { CreateEvidenceDocumentDto } from './dto/create-evidence-document.dto';
import { UpdateEvidenceDocumentDto } from './dto/update-evidence-document.dto';
import * as fs from 'fs';
import * as path from 'path';

type UploadedFile = {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
  size: number;
};

@Injectable()
export class EvidenceDocumentService {
  constructor(
    private readonly evidenceDocumentRepository: EvidenceDocumentRepository,
  ) {}

  async handleUpload(
    entityId: string,
    file: UploadedFile,
    isProfileLevel = true,
  ) {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, file.buffer);

    // If it's profile level, entityId is the entityProfileId. 
    // We should also find the associated sanctionedEntityId (Batch ID).
    let entityProfileId: string | null = null;
    let sanctionedEntityId: string = entityId;

    if (isProfileLevel) {
      entityProfileId = entityId;
      // Find the entity profile to get the sanctionedEntityId
      const profile = await this.evidenceDocumentRepository.manager.findOne(
        'EntityProfile',
        {
          where: { id: entityProfileId },
        },
      );
      if (profile) {
        sanctionedEntityId = (profile as any).sanctionedEntityId;
      }
    }

    const document = this.evidenceDocumentRepository.create({
      originalName: file.originalname,
      storagePath: `/uploads/${filename}`,
      sanctionedEntityId: sanctionedEntityId,
      entityProfileId: entityProfileId,
      mimeType: file.mimetype,
      sizeBytes: file.size,
    });

    return this.evidenceDocumentRepository.save(document);
  }

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
    
    // Physical file deletion
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    const filename = path.basename(document.storagePath);
    const filePath = path.join(uploadDir, filename);
    
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error(`Failed to delete physical file: ${filePath}`, err);
    }

    await this.evidenceDocumentRepository.remove(document);
    return { deleted: true };
  }
}
