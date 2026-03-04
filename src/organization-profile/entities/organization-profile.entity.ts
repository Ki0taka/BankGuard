import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrganizationProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
