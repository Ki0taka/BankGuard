import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { AddressTypeEnum } from '../../common/enums/address-type.enum';

export class CreateEntityAddressDto {
  @IsUUID()
  entityProfileId: string;

  @IsOptional()
  @IsEnum(AddressTypeEnum)
  addressType?: AddressTypeEnum;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  addressLine1: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  addressLine2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  addressLine3?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  postalCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;
}
