import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  IsDateString,
} from 'class-validator';
import { StatusEnum } from '../../common/enums/status.enum';

export class CreateEntityStatusDto {
  @IsUUID()
  entityProfileId: string;

  @IsEnum(StatusEnum)
  status: StatusEnum;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  reason?: string;

  @IsOptional()
  @IsDateString()
  effectiveDate?: string;
}
