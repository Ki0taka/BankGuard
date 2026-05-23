import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsUUID,
  Allow,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { BlacklistStatusEnum } from '../../common/enums/blacklist-status.enum';
import { PartialType } from '@nestjs/swagger';

export class CreateSanctionedEntityDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  source: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  blacklistId?: string;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsEnum(BlacklistStatusEnum)
  status?: BlacklistStatusEnum;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  entriesCount?: number;

  @IsOptional()
  manualData?: any[];

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsUUID()
  createdById?: string;

  // --- SYSTEM FIELDS (Ignored but allowed for round-trips) ---
  @IsOptional()
  @Allow()
  id?: string;

  @IsOptional()
  @Allow()
  createdAt?: Date | string;

  @IsOptional()
  @Allow()
  updatedAt?: Date | string;

  @IsOptional()
  @Allow()
  deletedAt?: Date | string | null;

  @IsOptional()
  @Allow()
  fileHash?: string | null;
}
