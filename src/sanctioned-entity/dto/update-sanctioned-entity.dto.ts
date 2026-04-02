import { PartialType } from '@nestjs/mapped-types';
import { CreateSanctionedEntityDto } from './create-sanctioned-entity.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateSanctionedEntityDto extends PartialType(
  CreateSanctionedEntityDto,
) {
  @IsOptional()
  @IsUUID()
  createdById?: string;
}
