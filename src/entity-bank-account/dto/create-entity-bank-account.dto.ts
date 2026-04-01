import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { AccountStatusEnum } from '../../common/enums/account-status.enum';

export class CreateEntityBankAccountDto {
  @IsUUID()
  entityProfileId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  bankName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  accountNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  iban?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  swiftCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @IsOptional()
  @IsEnum(AccountStatusEnum)
  status?: AccountStatusEnum;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;
}
