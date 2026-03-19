import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';
import { DocTypeEnum } from '../../common/enums/doc-type.enum';

export class CreateEvidenceDocumentDto {
  @IsUUID()
  sanctionedEntityId: string;

  @IsOptional()
  @IsEnum(DocTypeEnum)
  docType?: DocTypeEnum;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  originalName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  storagePath: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  mimeType?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sizeBytes?: number;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  checksum?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
