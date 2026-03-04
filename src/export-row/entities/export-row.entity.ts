import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExportRow {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
