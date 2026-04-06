import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WebhookTarget } from './webhook-target.entity';

@Entity('webhook_deliveries')
export class WebhookDelivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  targetId: string;

  @ManyToOne(() => WebhookTarget, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'targetId' })
  target: WebhookTarget;

  @Column({ type: 'text' })
  eventType: string;

  @Column({ type: 'json' })
  payload: any;

  @Column({ nullable: true })
  responseStatus: number;

  @Column({ type: 'text', nullable: true })
  responseBody: string;

  @Column({ default: 'PENDING' })
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'RETRYING';

  @Column({ default: 0 })
  attemptCount: number;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;
}
