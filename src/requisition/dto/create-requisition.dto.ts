import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { OperationEnum } from '../../common/enums/operation.enum';
import { WorkflowStatusEnum } from '../../common/enums/workflow-status.enum';

export class CreateRequisitionDto {
  @IsUUID()
  sanctionedEntityId: string;

  @IsOptional()
  @IsUUID()
  requestedById?: string;

  @IsEnum(OperationEnum)
  operation: OperationEnum;

  @IsOptional()
  @IsEnum(WorkflowStatusEnum)
  status?: WorkflowStatusEnum;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  reason?: string;
}
