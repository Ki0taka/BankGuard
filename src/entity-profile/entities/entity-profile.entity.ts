import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityTypeEnum } from '../../common/enums/entity-type.enum';
import { ListTypeEnum } from '../../common/enums/list-type.enum';
import { RiskEnum } from '../../common/enums/risk.enum';
import { QualityEnum } from '../../common/enums/quality.enum';
import { SanctionedEntity } from '../../sanctioned-entity/entities/sanctioned-entity.entity';
import { EntityName } from '../../entity-name/entities/entity-name.entity';
import { EntityAddress } from '../../entity-address/entities/entity-address.entity';
import { EntityDateOfBirth } from '../../entity-date-of-birth/entities/entity-date-of-birth.entity';
import { EntityStatus } from '../../entity-status/entities/entity-status.entity';
import { EntityBankAccount } from '../../entity-bank-account/entities/entity-bank-account.entity';
import { IndividualProfile } from '../../individual-profile/entities/individual-profile.entity';
import { OrganizationProfile } from '../../organization-profile/entities/organization-profile.entity';
import { VesselProfile } from '../../vessel-profile/entities/vessel-profile.entity';

@Entity('entity_profiles')
export class EntityProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  sanctionedEntityId: string;

  @OneToOne(() => SanctionedEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sanctionedEntityId' })
  sanctionedEntity: SanctionedEntity;

  @Column({
    type: 'enum',
    enum: EntityTypeEnum,
  })
  entityType: EntityTypeEnum;

  @Column({
    type: 'enum',
    enum: ListTypeEnum,
    nullable: true,
  })
  listType?: ListTypeEnum | null;

  @Column({
    type: 'enum',
    enum: RiskEnum,
    nullable: true,
  })
  risk?: RiskEnum | null;

  @Column({
    type: 'enum',
    enum: QualityEnum,
    nullable: true,
  })
  quality?: QualityEnum | null;

  @OneToMany(() => EntityName, (entityName) => entityName.entityProfile)
  names: EntityName[];

  @OneToMany(() => EntityAddress, (entityAddress) => entityAddress.entityProfile)
  addresses: EntityAddress[];

  @OneToMany(
    () => EntityDateOfBirth,
    (entityDob) => entityDob.entityProfile,
  )
  datesOfBirth: EntityDateOfBirth[];

  @OneToMany(() => EntityStatus, (entityStatus) => entityStatus.entityProfile)
  statuses: EntityStatus[];

  @OneToMany(
    () => EntityBankAccount,
    (entityBankAccount) => entityBankAccount.entityProfile,
  )
  bankAccounts: EntityBankAccount[];

  @OneToOne(
    () => IndividualProfile,
    (individualProfile) => individualProfile.entityProfile,
  )
  individualProfile?: IndividualProfile;

  @OneToOne(
    () => OrganizationProfile,
    (organizationProfile) => organizationProfile.entityProfile,
  )
  organizationProfile?: OrganizationProfile;

  @OneToOne(() => VesselProfile, (vesselProfile) => vesselProfile.entityProfile)
  vesselProfile?: VesselProfile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
