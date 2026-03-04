import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SyncedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
