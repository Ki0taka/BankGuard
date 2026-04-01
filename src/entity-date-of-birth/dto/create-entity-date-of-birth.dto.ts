import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { QualityEnum } from '../../common/enums/quality.enum';

export class CreateEntityDateOfBirthDto {
  @IsUUID()
  entityProfileId: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsOptional()
  @IsEnum(QualityEnum)
  quality?: QualityEnum;
}
