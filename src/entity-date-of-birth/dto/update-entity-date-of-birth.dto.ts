import { PartialType } from '@nestjs/mapped-types';
import { CreateEntityDateOfBirthDto } from './create-entity-date-of-birth.dto';

export class UpdateEntityDateOfBirthDto extends PartialType(CreateEntityDateOfBirthDto) {}
