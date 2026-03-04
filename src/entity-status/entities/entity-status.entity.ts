import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EntityStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
