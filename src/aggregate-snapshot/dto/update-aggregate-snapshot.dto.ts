import { PartialType } from '@nestjs/mapped-types';
import { CreateAggregateSnapshotDto } from './create-aggregate-snapshot.dto';

export class UpdateAggregateSnapshotDto extends PartialType(
  CreateAggregateSnapshotDto,
) {}
