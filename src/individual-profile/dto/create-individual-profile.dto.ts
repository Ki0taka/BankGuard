import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { GenderEnum } from '../../common/enums/gender.enum';

export class CreateIndividualProfileDto {
  @IsUUID()
  entityProfileId: string;

  @IsOptional()
  @IsEnum(GenderEnum)
  gender?: GenderEnum;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  nationality?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  placeOfBirth?: string;
}
