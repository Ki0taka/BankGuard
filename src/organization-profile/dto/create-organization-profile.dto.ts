import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  IsDateString,
} from 'class-validator';

export class CreateOrganizationProfileDto {
  @IsUUID()
  entityProfileId: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  registrationNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  registrationCountry?: string;

  @IsOptional()
  @IsDateString()
  incorporationDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  industry?: string;
}
