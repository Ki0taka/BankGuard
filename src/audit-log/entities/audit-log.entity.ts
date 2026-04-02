import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AuditActionEnum } from '../../common/enums/audit-action.enum';
import { User } from '../../user/entities/user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AuditActionEnum,
  })
  action: AuditActionEnum;

  @Column({ type: 'text' })
  entityType: string;

  @Column({ type: 'text' })
  entityId: string;

  @Column({ type: 'uuid', nullable: true })
  actorId?: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'actorId' })
  user?: User | null;

  @Column({ type: 'text', nullable: true })
  actorEmail?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  before?: Record<string, unknown> | null;

  @Column({ type: 'jsonb', nullable: true })
  after?: Record<string, unknown> | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt: Date;
}
