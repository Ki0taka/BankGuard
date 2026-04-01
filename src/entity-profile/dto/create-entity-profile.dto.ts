import {
  IsEnum,
  IsOptional,
  IsUUID,
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
}
