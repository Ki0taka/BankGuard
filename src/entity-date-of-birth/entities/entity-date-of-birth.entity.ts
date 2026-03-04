import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EntityDateOfBirth {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
