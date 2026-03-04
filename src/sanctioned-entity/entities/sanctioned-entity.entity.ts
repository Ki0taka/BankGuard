import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SanctionedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
