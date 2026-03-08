import { PartialType } from '@nestjs/mapped-types';
import { CreateSanctionedEntityDto } from './create-sanctioned-entity.dto';

export class UpdateSanctionedEntityDto extends PartialType(
  CreateSanctionedEntityDto,
) {}
