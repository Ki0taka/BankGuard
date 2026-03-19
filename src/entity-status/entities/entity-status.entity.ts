import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { StatusEnum } from '../../common/enums/status.enum';
import { EntityProfile } from '../../entity-profile/entities/entity-profile.entity';

@Entity('entity_statuses')
export class EntityStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  entityProfileId: string;

  @ManyToOne(() => EntityProfile, (entityProfile) => entityProfile.statuses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'entityProfileId' })
  entityProfile: EntityProfile;

  @Column({
    type: 'enum',
    enum: StatusEnum,
  })
  status: StatusEnum;

  @Column({ type: 'text', nullable: true })
  reason?: string | null;

  @Column({ type: 'date', nullable: true })
  effectiveDate?: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
