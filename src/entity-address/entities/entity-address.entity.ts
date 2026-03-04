import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EntityAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
