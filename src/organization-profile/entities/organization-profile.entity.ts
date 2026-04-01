import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityProfile } from '../../entity-profile/entities/entity-profile.entity';
import { getEncryptionTransformer } from '../../common/encryption/encryption.singleton';

const encryptionTransformer = getEncryptionTransformer();

@Entity('organization_profiles')
export class OrganizationProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  entityProfileId: string;

  @OneToOne(
    () => EntityProfile,
    (entityProfile) => entityProfile.organizationProfile,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'entityProfileId' })
  entityProfile: EntityProfile;

  @Column({ type: 'text', nullable: true, transformer: encryptionTransformer })
  registrationNumber?: string | null;

  @Column({ type: 'text', nullable: true })
  registrationCountry?: string | null;

  @Column({ type: 'date', nullable: true })
  incorporationDate?: string | null;

  @Column({ type: 'text', nullable: true })
  industry?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
