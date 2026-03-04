import { PartialType } from '@nestjs/mapped-types';
import { CreateSyncRunDto } from './create-sync-run.dto';

export class UpdateSyncRunDto extends PartialType(CreateSyncRunDto) {}
