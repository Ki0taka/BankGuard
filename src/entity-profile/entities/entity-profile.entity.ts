import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EntityProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
