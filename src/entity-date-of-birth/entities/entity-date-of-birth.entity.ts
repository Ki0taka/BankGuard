import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QualityEnum } from '../../common/enums/quality.enum';
import { EntityProfile } from '../../entity-profile/entities/entity-profile.entity';
import { getEncryptionTransformer } from '../../common/encryption/encryption.singleton';

const encryptionTransformer = getEncryptionTransformer();

@Entity('entity_dates_of_birth')
export class EntityDateOfBirth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  entityProfileId: string;

  @ManyToOne(
    () => EntityProfile,
    (entityProfile) => entityProfile.datesOfBirth,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'entityProfileId' })
  entityProfile: EntityProfile;

  @Column({ type: 'text', transformer: encryptionTransformer })
  dateOfBirth: string;

  @Column({
    type: 'enum',
    enum: QualityEnum,
    nullable: true,
  })
  quality?: QualityEnum | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
