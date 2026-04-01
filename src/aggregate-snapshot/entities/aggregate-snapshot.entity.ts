import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { EntityProfile } from '../../entity-profile/entities/entity-profile.entity';

@Entity('aggregate_snapshots')
export class AggregateSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  entityProfileId: string;

  @ManyToOne(() => EntityProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'entityProfileId' })
  entityProfile: EntityProfile;

  @Column({ type: 'jsonb' })
  snapshot: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;
}
