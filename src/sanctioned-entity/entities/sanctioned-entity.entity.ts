import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { BlacklistStatusEnum } from '../../common/enums/blacklist-status.enum';
import { EvidenceDocument } from '../../evidence-document/entities/evidence-document.entity';
import { Review } from '../../review/entities/review.entity';
import { EntityProfile } from '../../entity-profile/entities/entity-profile.entity';

@Entity('sanctioned_entities')
export class SanctionedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** User-provided batch label, e.g. "LIST-2026-01" */
  @Column({ type: 'text', nullable: true })
  blacklistId?: string | null;

  @Column({ type: 'text' })
  source: string;

  @Column({
    type: 'enum',
    enum: BlacklistStatusEnum,
    default: BlacklistStatusEnum.READY,
  })
  status: BlacklistStatusEnum;

  /** Cached count of entries in this batch */
  @Column({ type: 'int', default: 0 })
  entriesCount: number;

  @Column({ type: 'text', nullable: true })
  date?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // --- Relations ---

  /** A batch contains many entity profiles (entries) */
  @OneToMany(
    () => EntityProfile,
    (entityProfile) => entityProfile.sanctionedEntity,
    { cascade: true },
  )
  entityProfiles: EntityProfile[];

  @OneToMany(
    () => EvidenceDocument,
    (evidenceDocument) => evidenceDocument.sanctionedEntity,
  )
  evidenceDocuments: EvidenceDocument[];

  @OneToMany(() => Review, (review) => review.sanctionedEntity)
  reviews: Review[];

  @Column({ type: 'uuid', nullable: true })
  createdById: string | null;

  @ManyToOne('User', { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy: any;
}
