import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExternalSource {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
