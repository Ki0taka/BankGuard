import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EvidenceDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
