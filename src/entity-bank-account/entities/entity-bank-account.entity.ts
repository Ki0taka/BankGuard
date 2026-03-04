import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EntityBankAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
