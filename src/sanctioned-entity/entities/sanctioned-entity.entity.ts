import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BlacklistStatusEnum } from '../../common/enums/blacklist-status.enum';
import { getEncryptionTransformer } from '../../common/encryption/encryption.singleton';
import { EvidenceDocument } from '../../evidence-document/entities/evidence-document.entity';
import { Review } from '../../review/entities/review.entity';

const encryptionTransformer = getEncryptionTransformer();

@Entity('sanctioned_entities')
export class SanctionedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', transformer: encryptionTransformer })
  fullName: string;

  @Column({ type: 'text', nullable: true, transformer: encryptionTransformer })
  alias?: string | null;

  @Column({ type: 'text', nullable: true, transformer: encryptionTransformer })
  dateOfBirth?: string | null;

  @Column({ type: 'text', nullable: true, transformer: encryptionTransformer })
  nationality?: string | null;

  @Column({ type: 'text' })
  source: string;

  @Column({ type: 'text', nullable: true, transformer: encryptionTransformer })
  justification?: string | null;

  @Column({
    type: 'enum',
    enum: BlacklistStatusEnum,
    default: BlacklistStatusEnum.PENDING,
  })
  status: BlacklistStatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => EvidenceDocument,
    (evidenceDocument) => evidenceDocument.sanctionedEntity,
  )
  evidenceDocuments: EvidenceDocument[];

  @OneToMany(() => Review, (review) => review.sanctionedEntity)
  reviews: Review[];
}
