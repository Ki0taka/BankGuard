import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AddressTypeEnum } from '../../common/enums/address-type.enum';
import { EntityProfile } from '../../entity-profile/entities/entity-profile.entity';
import { getEncryptionTransformer } from '../../common/encryption/encryption.singleton';

const encryptionTransformer = getEncryptionTransformer();

@Entity('entity_addresses')
export class EntityAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  entityProfileId: string;

  @ManyToOne(() => EntityProfile, (entityProfile) => entityProfile.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'entityProfileId' })
  entityProfile: EntityProfile;

  @Column({
    type: 'enum',
    enum: AddressTypeEnum,
    default: AddressTypeEnum.CORRESPONDENCE,
  })
  addressType: AddressTypeEnum;

  @Column({ type: 'text', transformer: encryptionTransformer })
  addressLine1: string;

  @Column({ type: 'text', nullable: true, transformer: encryptionTransformer })
  addressLine2?: string | null;

  @Column({ type: 'text', nullable: true, transformer: encryptionTransformer })
  addressLine3?: string | null;

  @Column({ type: 'text', nullable: true, transformer: encryptionTransformer })
  city?: string | null;

  @Column({ type: 'text', nullable: true, transformer: encryptionTransformer })
  state?: string | null;

  @Column({ type: 'text', nullable: true, transformer: encryptionTransformer })
  postalCode?: string | null;

  @Column({ type: 'text', nullable: true, transformer: encryptionTransformer })
  country?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
