import { PartialType } from '@nestjs/mapped-types';
import { CreateExportRowDto } from './create-export-row.dto';

export class UpdateExportRowDto extends PartialType(CreateExportRowDto) {}
