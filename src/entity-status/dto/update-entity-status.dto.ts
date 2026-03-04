import { PartialType } from '@nestjs/mapped-types';
import { CreateEntityStatusDto } from './create-entity-status.dto';

export class UpdateEntityStatusDto extends PartialType(CreateEntityStatusDto) {}
