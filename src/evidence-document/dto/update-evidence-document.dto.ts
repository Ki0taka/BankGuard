import { PartialType } from '@nestjs/mapped-types';
import { CreateEvidenceDocumentDto } from './create-evidence-document.dto';

export class UpdateEvidenceDocumentDto extends PartialType(CreateEvidenceDocumentDto) {}
