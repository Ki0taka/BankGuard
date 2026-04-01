import { IsNotEmpty, IsObject, IsUUID } from 'class-validator';

export class CreateAggregateSnapshotDto {
  @IsUUID()
  entityProfileId: string;

  @IsNotEmpty()
  @IsObject()
  snapshot: Record<string, unknown>;
}
