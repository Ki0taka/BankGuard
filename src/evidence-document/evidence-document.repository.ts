import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EvidenceDocument } from './entities/evidence-document.entity';

@Injectable()
export class EvidenceDocumentRepository extends Repository<EvidenceDocument> {
  constructor(private dataSource: DataSource) {
    super(EvidenceDocument, dataSource.createEntityManager());
  }
}
