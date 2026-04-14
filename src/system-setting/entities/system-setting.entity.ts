import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class SystemSetting {
  @PrimaryColumn()
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ nullable: true })
  description: string;
}
