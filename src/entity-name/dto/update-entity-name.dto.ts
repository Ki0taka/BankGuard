import { PartialType } from '@nestjs/mapped-types';
import { CreateEntityNameDto } from './create-entity-name.dto';

export class UpdateEntityNameDto extends PartialType(CreateEntityNameDto) {}
