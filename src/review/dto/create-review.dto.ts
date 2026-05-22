import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Allow,
} from 'class-validator';
import { ReviewDecisionEnum } from '../../common/enums/review-decision.enum';

export class CreateReviewDto {
  @IsUUID()
  sanctionedEntityId: string;

  @IsUUID()
  @IsOptional()
  reviewerId: string;

  @IsEnum(ReviewDecisionEnum)
  decision: ReviewDecisionEnum;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comment?: string;

  // --- SYSTEM & RELATIONAL FIELDS ---
  @IsOptional() @Allow() id?: string;
  @IsOptional() @Allow() createdAt?: Date | string;
  @IsOptional() @Allow() updatedAt?: Date | string;
  @IsOptional() @Allow() deletedAt?: Date | string | null;

  @IsOptional() @Allow() reviewer?: any;
  @IsOptional() @Allow() sanctionedEntity?: any;
}
