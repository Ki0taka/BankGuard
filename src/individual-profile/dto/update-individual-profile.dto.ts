import { PartialType } from '@nestjs/mapped-types';
import { CreateIndividualProfileDto } from './create-individual-profile.dto';

export class UpdateIndividualProfileDto extends PartialType(
  CreateIndividualProfileDto,
) {}
