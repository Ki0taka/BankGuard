import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('webhook_targets')
export class WebhookTarget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  url: string;

  @Column()
  secretKey: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'simple-array', nullable: true })
  eventTypes: string[];

  @Column({ default: 'JSON' })
  format: 'JSON' | 'XML' | 'EXCEL' | 'HMT' | 'CUSTOM';

  @Column({ type: 'json', nullable: true })
  mapping: Record<string, string>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
