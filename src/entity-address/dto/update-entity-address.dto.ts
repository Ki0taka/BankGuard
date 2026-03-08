import { PartialType } from '@nestjs/mapped-types';
import { CreateEntityAddressDto } from './create-entity-address.dto';

export class UpdateEntityAddressDto extends PartialType(
  CreateEntityAddressDto,
) {}
