import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { NameTypeEnum } from '../../common/enums/name-type.enum';
import { ScriptEnum } from '../../common/enums/script.enum';

export class CreateEntityNameDto {
  @IsUUID()
  entityProfileId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  name: string;

  @IsOptional()
  @IsEnum(NameTypeEnum)
  nameType?: NameTypeEnum;

  @IsOptional()
  @IsEnum(ScriptEnum)
  script?: ScriptEnum;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
