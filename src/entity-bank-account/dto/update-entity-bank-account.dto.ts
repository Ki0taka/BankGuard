import { PartialType } from '@nestjs/mapped-types';
import { CreateEntityBankAccountDto } from './create-entity-bank-account.dto';

export class UpdateEntityBankAccountDto extends PartialType(
  CreateEntityBankAccountDto,
) {}
