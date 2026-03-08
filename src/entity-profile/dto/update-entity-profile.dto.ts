import { PartialType } from '@nestjs/mapped-types';
import { CreateEntityProfileDto } from './create-entity-profile.dto';

export class UpdateEntityProfileDto extends PartialType(
  CreateEntityProfileDto,
) {}
