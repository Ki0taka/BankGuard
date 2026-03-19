import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountStatusEnum } from '../../common/enums/account-status.enum';
import { EntityProfile } from '../../entity-profile/entities/entity-profile.entity';
import { getEncryptionTransformer } from '../../common/encryption/encryption.singleton';

const encryptionTransformer = getEncryptionTransformer();

@Entity('entity_bank_accounts')
export class EntityBankAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  entityProfileId: string;

  @ManyToOne(
    () => EntityProfile,
    (entityProfile) => entityProfile.bankAccounts,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'entityProfileId' })
  entityProfile: EntityProfile;

  @Column({ type: 'text' })
  bankName: string;

  @Column({ type: 'text', transformer: encryptionTransformer })
  accountNumber: string;

  @Column({ type: 'text', nullable: true, transformer: encryptionTransformer })
  iban?: string | null;

  @Column({ type: 'text', nullable: true })
  swiftCode?: string | null;

  @Column({ type: 'text', nullable: true })
  currency?: string | null;

  @Column({
    type: 'enum',
    enum: AccountStatusEnum,
    nullable: true,
  })
  status?: AccountStatusEnum | null;

  @Column({ type: 'text', nullable: true })
  country?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
