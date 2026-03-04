import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SyncRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
