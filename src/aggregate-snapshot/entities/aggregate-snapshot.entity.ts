import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AggregateSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
