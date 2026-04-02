import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DocTypeEnum } from '../../common/enums/doc-type.enum';
import { SanctionedEntity } from '../../sanctioned-entity/entities/sanctioned-entity.entity';
import { EntityProfile } from '../../entity-profile/entities/entity-profile.entity';
import { getEncryptionTransformer } from '../../common/encryption/encryption.singleton';

const encryptionTransformer = getEncryptionTransformer();

@Entity('evidence_documents')
export class EvidenceDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  sanctionedEntityId: string;

  @ManyToOne(
    () => SanctionedEntity,
    (sanctionedEntity) => sanctionedEntity.evidenceDocuments,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'sanctionedEntityId' })
  sanctionedEntity: SanctionedEntity;

  /** Optional: link document to a specific entry (EntityProfile) */
  @Column({ type: 'uuid', nullable: true })
  entityProfileId?: string | null;

  @ManyToOne(() => EntityProfile, (ep) => ep.evidenceDocuments, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'entityProfileId' })
  entityProfile?: EntityProfile;

  @Column({
    type: 'enum',
    enum: DocTypeEnum,
    default: DocTypeEnum.OTHER,
  })
  docType: DocTypeEnum;

  @Column({ type: 'text', transformer: encryptionTransformer })
  originalName: string;

  @Column({ type: 'text' })
  storagePath: string;

  @Column({ type: 'text', nullable: true })
  mimeType?: string | null;

  @Column({ type: 'int', nullable: true })
  sizeBytes?: number | null;

  @Column({ type: 'text', nullable: true })
  checksum?: string | null;

  @Column({ type: 'text', nullable: true, transformer: encryptionTransformer })
  description?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
