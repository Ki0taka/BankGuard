import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class IndividualProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
