import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VesselProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
