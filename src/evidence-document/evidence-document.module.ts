import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvidenceDocumentService } from './evidence-document.service';
import { EvidenceDocumentController } from './evidence-document.controller';
import { EvidenceDocumentRepository } from './evidence-document.repository';
import { EvidenceDocument } from './entities/evidence-document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EvidenceDocument])],
  controllers: [EvidenceDocumentController],
  providers: [EvidenceDocumentService, EvidenceDocumentRepository],
  exports: [EvidenceDocumentService, EvidenceDocumentRepository],
})
export class EvidenceDocumentModule {}
