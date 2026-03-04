import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Requisition {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
