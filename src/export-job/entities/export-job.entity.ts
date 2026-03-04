import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExportJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
