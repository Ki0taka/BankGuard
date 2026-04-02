import {
  IsEnum,
  IsOptional,
  IsUUID,
  Allow,
} from 'class-validator';
import { EntityTypeEnum } from '../../common/enums/entity-type.enum';
import { ListTypeEnum } from '../../common/enums/list-type.enum';
import { RiskEnum } from '../../common/enums/risk.enum';
import { QualityEnum } from '../../common/enums/quality.enum';

export class CreateEntityProfileDto {
  @IsUUID()
  sanctionedEntityId: string;

  @IsEnum(EntityTypeEnum)
  entityType: EntityTypeEnum;

  @IsOptional()
  @IsEnum(ListTypeEnum)
  listType?: ListTypeEnum;

  @IsOptional()
  @IsEnum(RiskEnum)
  risk?: RiskEnum;

  @IsOptional()
  @IsEnum(QualityEnum)
  quality?: QualityEnum;

  // --- PERSON-LEVEL FIELDS (Allowed but usually managed via rawData) ---
  @IsOptional() @Allow() fullName?: string;
  @IsOptional() @Allow() alias?: string;
  @IsOptional() @Allow() dateOfBirth?: string;
  @IsOptional() @Allow() nationality?: string;
  @IsOptional() @Allow() groupId?: number;
  @IsOptional() @Allow() listedOn?: string;
  @IsOptional() @Allow() otherInformation?: string;
  @IsOptional() @Allow() rawData?: any;

  // --- SYSTEM & RELATIONAL FIELDS (Ignored but allowed for round-trips) ---
  @IsOptional() @Allow() id?: string;
  @IsOptional() @Allow() createdAt?: Date | string;
  @IsOptional() @Allow() updatedAt?: Date | string;
  @IsOptional() @Allow() deletedAt?: Date | string | null;
  
  @IsOptional() @Allow() names?: any[];
  @IsOptional() @Allow() addresses?: any[];
  @IsOptional() @Allow() datesOfBirth?: any[];
  @IsOptional() @Allow() individualProfile?: any;
  @IsOptional() @Allow() organizationProfile?: any;
  @IsOptional() @Allow() vesselProfile?: any;
  @IsOptional() @Allow() evidenceDocuments?: any[];
  @IsOptional() @Allow() errors?: string[];
  @IsOptional() @Allow() sanctionedEntity?: any;
}
