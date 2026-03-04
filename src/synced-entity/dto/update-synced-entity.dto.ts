import { PartialType } from '@nestjs/mapped-types';
import { CreateSyncedEntityDto } from './create-synced-entity.dto';

export class UpdateSyncedEntityDto extends PartialType(CreateSyncedEntityDto) {}
