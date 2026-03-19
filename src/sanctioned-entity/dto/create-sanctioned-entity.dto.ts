import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { BlacklistStatusEnum } from '../../common/enums/blacklist-status.enum';

export class CreateSanctionedEntityDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  fullName: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  alias?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  nationality?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  source: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  justification?: string;

  @IsOptional()
  @IsEnum(BlacklistStatusEnum)
  status?: BlacklistStatusEnum;
}
