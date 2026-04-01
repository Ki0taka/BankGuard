import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsObject,
} from 'class-validator';
import { AuditActionEnum } from '../../common/enums/audit-action.enum';

export class CreateAuditLogDto {
  @IsEnum(AuditActionEnum)
  action: AuditActionEnum;

  @IsString()
  @IsNotEmpty()
  entityType: string;

  @IsUUID()
  entityId: string;

  @IsOptional()
  @IsUUID()
  actorId?: string;

  @IsOptional()
  @IsString()
  actorEmail?: string;

  @IsOptional()
  @IsObject()
  before?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  after?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
