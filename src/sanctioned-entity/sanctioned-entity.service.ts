import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SanctionedEntityRepository } from './sanctioned-entity.repository';
import { CreateSanctionedEntityDto } from './dto/create-sanctioned-entity.dto';
import { UpdateSanctionedEntityDto } from './dto/update-sanctioned-entity.dto';
import { BlacklistStatusEnum } from '../common/enums/blacklist-status.enum';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AuditActionEnum } from '../common/enums/audit-action.enum';
import { EntityTypeEnum } from '../common/enums/entity-type.enum';
import { SanctionedEntity } from './entities/sanctioned-entity.entity';
import { EntityProfile } from '../entity-profile/entities/entity-profile.entity';
import { EntityName } from '../entity-name/entities/entity-name.entity';
import { EntityDateOfBirth } from '../entity-date-of-birth/entities/entity-date-of-birth.entity';
import { EntityAddress } from '../entity-address/entities/entity-address.entity';
import { IndividualProfile } from '../individual-profile/entities/individual-profile.entity';
import { NameTypeEnum } from '../common/enums/name-type.enum';
import { AddressTypeEnum } from '../common/enums/address-type.enum';
import { DataSource, EntityManager, Not, IsNull } from 'typeorm';
import { SanctionedEntityStatusChangedEvent } from '../events/sanctioned-entity-status-changed.event';
import * as xlsx from 'xlsx';

@Injectable()
export class SanctionedEntityService {
  private readonly logger = new Logger(SanctionedEntityService.name);

  constructor(
    private readonly sanctionedEntityRepository: SanctionedEntityRepository,
    private readonly auditLogService: AuditLogService,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ─────────────────────────────────────────────────────
  //  CRUD — SanctionedEntity is the BATCH / blacklist
  // ─────────────────────────────────────────────────────

  async create(dto: CreateSanctionedEntityDto) {
    const entity = this.sanctionedEntityRepository.create({
      source: dto.source,
      blacklistId: dto.blacklistId || null,
      status: dto.status ?? BlacklistStatusEnum.READY,
      date: dto.date || new Date().toISOString().split('T')[0],
      entriesCount: 0,
      createdById: dto.createdById || null,
    });
    const saved = await this.sanctionedEntityRepository.save(entity);

    await this.auditLogService.log({
      action: AuditActionEnum.SANCTIONED_ENTITY_CREATED,
      entityType: 'SanctionedEntity',
      entityId: saved.id,
      metadata: { status: saved.status },
    });
    return saved;
  }

  /** Returns all batches (blacklists) with their entry counts */
  findAll() {
    return this.sanctionedEntityRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const entity = await this.sanctionedEntityRepository.findOne({
      where: { id },
    });
    if (!entity) {
      throw new NotFoundException('Sanctioned entity not found');
    }
    return entity;
  }

  async update(id: string, dto: Record<string, any>) {
    const entity = await this.findOne(id);
    const previousStatus = entity.status;
    const nextStatus = dto.status;
    if (nextStatus && nextStatus !== entity.status) {
      this.assertValidStatusTransition(entity.status, nextStatus);
    }

    // Update batch metadata
    if (dto.source) entity.source = dto.source;
    if (dto.blacklistId !== undefined) entity.blacklistId = dto.blacklistId;
    if (dto.status) entity.status = dto.status;

    // Handle manualData sync if provided by the frontend
    if (dto.manualData && Array.isArray(dto.manualData)) {
      const existingEntries = await this.dataSource.getRepository(EntityProfile).find({
        where: { sanctionedEntityId: id },
        select: ['id'],
      });

      const manualIdSet = new Set(dto.manualData.map((e: any) => String(e.id)));
      const existingIds = existingEntries.map((e) => e.id);

      // 1. Delete removed
      const toDelete = existingIds.filter(id => !manualIdSet.has(id));
      console.log(`[Update Batch] Calculated toDelete: ${toDelete.length} entries out of ${existingIds.length} existing.`);
      for (const delId of toDelete) {
        await this.deleteEntry(delId);
      }

      // 2. Add or Update
      let addCount = 0;
      let updateCount = 0;
      let skippedCount = 0;

      for (const manualEntry of dto.manualData) {
        const isNew = String(manualEntry.id).length < 20; // frontend uses Date.now() for new
        if (isNew) {
          addCount++;
          await this.addEntry(id, manualEntry);
        } else if (manualEntry._isDirty === true) {
          updateCount++;
          await this.updateEntry(manualEntry.id, manualEntry);
        } else {
          skippedCount++;
        }
      }
      
      console.log(`[Update Batch] Finished. Added: ${addCount}, Updated: ${updateCount}, Skipped: ${skippedCount}`);
      entity.entriesCount = dto.manualData.length;
    }

    const saved = await this.sanctionedEntityRepository.save(entity);
    if (nextStatus && nextStatus !== previousStatus) {
      await this.auditLogService.log({
        action: AuditActionEnum.SANCTIONED_ENTITY_STATUS_CHANGED,
        entityType: 'SanctionedEntity',
        entityId: saved.id,
        before: { status: previousStatus },
        after: { status: saved.status },
      });

      // Emit Event for Webhooks
      const statusEvent = new SanctionedEntityStatusChangedEvent();
      statusEvent.aggregateId = saved.id;
      statusEvent.aggregateType = 'SanctionedEntity';
      statusEvent.previousStatus = previousStatus;
      statusEvent.newStatus = saved.status;
      statusEvent.occurredAt = new Date();
      
      this.eventEmitter.emit('SANCTIONED_ENTITY_STATUS_CHANGED', statusEvent);
    }
    return saved;
  }

  async remove(id: string) {
    const entity = await this.findOne(id);
    await this.sanctionedEntityRepository.softDelete(id);

    await this.auditLogService.log({
      action: AuditActionEnum.SANCTIONED_ENTITY_REMOVED,
      entityType: 'SanctionedEntity',
      entityId: id,
      metadata: { source: entity.source, softDelete: true },
    });

    return { archived: true };
  }

  /** Returns only soft-deleted (archived) blacklists */
  async findAllArchived() {
    return this.sanctionedEntityRepository.find({
      where: { deletedAt: Not(IsNull()) },
      withDeleted: true,
      order: { deletedAt: 'DESC' },
    });
  }

  /** Restores a soft-deleted blacklist */
  async restore(id: string) {
    await this.sanctionedEntityRepository.restore(id);
    const restored = await this.findOne(id);

    await this.auditLogService.log({
      action: AuditActionEnum.ENTITY_UPDATED,
      entityType: 'SanctionedEntity',
      entityId: id,
      metadata: { action: 'restore', source: restored.source },
    });

    return restored;
  }

  /** Permanently deletes a blacklist and all its entries */
  async permanentDelete(id: string) {
    const entity = await this.sanctionedEntityRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!entity) throw new NotFoundException('Sanctioned entity not found');

    // Hard delete
    await this.sanctionedEntityRepository.delete(id);

    await this.auditLogService.log({
      action: AuditActionEnum.SANCTIONED_ENTITY_REMOVED,
      entityType: 'SanctionedEntity',
      entityId: id,
      metadata: { source: entity.source, permanent: true },
    });

    return { deleted: true };
  }

  // ─────────────────────────────────────────────────────
  //  ENTRIES — EntityProfile rows inside a batch
  // ─────────────────────────────────────────────────────

  /** Get all entries (EntityProfiles) for a given batch */
  async getEntries(sanctionedEntityId: string) {
    await this.findOne(sanctionedEntityId); // ensure exists
    const profileRepo = this.dataSource.getRepository(EntityProfile);
    const profiles = await profileRepo.find({
      where: { sanctionedEntityId },
      relations: [
        'names',
        'addresses',
        'datesOfBirth',
        'individualProfile',
        'evidenceDocuments',
      ],
      order: { createdAt: 'ASC' },
    });

    // Flatten each profile into the column format the frontend expects
    return profiles.map((p) => this.flattenProfile(p));
  }

  /** Add a single entry to an existing batch */
  async addEntry(sanctionedEntityId: string, entryData: any) {
    const batch = await this.findOne(sanctionedEntityId);

    const result = await this.dataSource.transaction(async (manager) => {
      return this.createEntryProfile(manager, sanctionedEntityId, entryData);
    });

    // Update entry count
    batch.entriesCount = (batch.entriesCount || 0) + 1;
    await this.sanctionedEntityRepository.save(batch);

    return result;
  }

  /** Update an existing entry */
  async updateEntry(entryId: string, entryData: any) {
    const profileRepo = this.dataSource.getRepository(EntityProfile);
    const profile = await profileRepo.findOne({ where: { id: entryId } });
    if (!profile) {
      throw new NotFoundException('Entry not found');
    }
    Object.assign(profile, {
      fullName: entryData.fullName || profile.fullName,
      nationality: entryData.nationality || profile.nationality,
      dateOfBirth: entryData.dob || profile.dateOfBirth,
      groupId: entryData.groupId || profile.groupId,
      rawData: { ...(profile.rawData || {}), ...entryData },
    });
    return profileRepo.save(profile);
  }

  /** Delete an existing entry */
  async deleteEntry(entryId: string) {
    const profileRepo = this.dataSource.getRepository(EntityProfile);
    const profile = await profileRepo.findOne({
      where: { id: entryId },
      relations: ['sanctionedEntity'],
    });
    if (!profile) {
      throw new NotFoundException('Entry not found');
    }

    const batchId = profile.sanctionedEntityId;
    await profileRepo.softDelete(entryId);

    // Update entry count
    const batch = await this.findOne(batchId);
    batch.entriesCount = Math.max(0, (batch.entriesCount || 1) - 1);
    await this.sanctionedEntityRepository.save(batch);

    return { deleted: true };
  }

  // ─────────────────────────────────────────────────────
  //  BULK — Excel upload & manual batch
  // ─────────────────────────────────────────────────────

  async processExcelUpload(file: Express.Multer.File, metadata: any) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const datasheet = workbook.Sheets[sheetName];
    const rows: any[] = xlsx.utils.sheet_to_json(datasheet);

    const saved = await this.dataSource.transaction(async (manager) => {
      // 1. Create ONE batch (SanctionedEntity)
      const batch = manager.create(SanctionedEntity, {
        source: String(metadata.source || 'Excel Upload'),
        blacklistId: String(metadata.blacklistId || 'N/A'),
        status: (metadata.status || BlacklistStatusEnum.READY) as BlacklistStatusEnum,
        date: new Date().toISOString().split('T')[0],
        entriesCount: rows.length,
        createdById: metadata.createdById || null,
      });
      const savedBatch = await manager.save(batch);

      // 2. Create N entries (EntityProfiles) inside that batch
      try {
        for (const row of rows) {
          const extractedFullName = row.Name || row.FullName || row.fullName || row['Full Name'];
          
          await this.createEntryProfile(manager, savedBatch.id, {
            fullName: extractedFullName ? String(extractedFullName) : undefined,
            alias: row.Alias || row.alias || row.AKA || null,
            dob: this.parseExcelDate(row.DOB || row.dob || row['Date of Birth']),
            nationality: row.Nationality || row.nationality || row.Country || null,
            placeOfBirth: row.PlaceOfBirth || row['Place of Birth'] || row['Town of Birth'] || null,
            townOfBirth: row['Town of Birth'] || row.PlaceOfBirth || row['Place of Birth'] || null,
            countryOfBirth: row['Country of Birth'] || row.countryOfBirth || null,
            addresses: [row.Address || row.address || row.Location || null],
            groupId: row.GroupID || row.groupId || row.group_id || row['Group ID'] || null,
            listedOn: this.parseExcelDate(row.ListedOn || row['Listed On']),
            otherInfo: row.OtherInfo || row['Other Information'] || null,
            passportNum: row.PassportNum || row['Passport Number'] || null,
            nationalId: row.NationalId || row['National ID'] || null,
            // HMT name fields
            name1: row['Name 1'] || row.name1 || null,
            name2: row['Name 2'] || row.name2 || null,
            name3: row['Name 3'] || row.name3 || null,
            name4: row['Name 4'] || row.name4 || null,
            name5: row['Name 5'] || row.name5 || null,
            name6: row['Name 6'] || row.name6 || null,
            title: row.Title || row.title || null,
            nameNonLatin: row['Name Non-Latin Script'] || row['Name Non-Latin'] || row.nameNonLatin || null,
            country: row.Country || row.country || null,
            groupType: row['Group Type'] || row.groupType || null,
            aliasType: row['Alias Type'] || row.aliasType || null,
          });
        }
      } catch (error) {
        this.logger.error(`Error processing Excel upload: ${error.message}`, error.stack);
        throw new BadRequestException(`Excel upload failed: ${error.message}`);
      }

      return savedBatch;
    });

    await this.auditLogService.log({
      action: AuditActionEnum.SANCTIONED_ENTITY_CREATED,
      entityType: 'SanctionedEntity',
      entityId: saved.id,
      metadata: { count: rows.length, source: metadata.source },
    });

    return saved;
  }

  async bulkCreate(payload: { source: string; blacklistId?: string; entries: any[]; createdById?: string }) {
    const { source, blacklistId, entries, createdById } = payload;

    const saved = await this.dataSource.transaction(async (manager) => {
      // 1. Create ONE batch (SanctionedEntity)
      const batch = manager.create(SanctionedEntity, {
        source: String(source),
        blacklistId: blacklistId || null,
        status: BlacklistStatusEnum.READY,
        date: new Date().toISOString().split('T')[0],
        entriesCount: entries.length,
        createdById: createdById || null,
      });
      const savedBatch = await manager.save(batch);

      // 2. Create entries inside it
      try {
        for (const entryData of entries) {
          await this.createEntryProfile(manager, savedBatch.id, entryData);
        }
      } catch (error) {
        this.logger.error(`Error processing bulk create: ${error.message}`, error.stack);
        throw new BadRequestException(`Bulk create failed: ${error.message}`);
      }

      return savedBatch;
    });

    await this.auditLogService.log({
      action: AuditActionEnum.SANCTIONED_ENTITY_CREATED,
      entityType: 'SanctionedEntity',
      entityId: saved.id,
      metadata: { count: entries.length, source, blacklistId },
    });

    return saved;
  }

  // ─────────────────────────────────────────────────────
  //  STATS
  // ─────────────────────────────────────────────────────

  async getStats() {
    const totalBlacklists = await this.sanctionedEntityRepository.count();

    const profileRepo = this.dataSource.getRepository(EntityProfile);
    const totalEntries = await profileRepo.count();

    return {
      totalBlacklists,
      totalEntries,
      activeUsers: 3,
      recentActivity: 15,
    };
  }

  // ─────────────────────────────────────────────────────
  //  PRIVATE HELPERS
  // ─────────────────────────────────────────────────────

  /**
   * Creates a single entry (EntityProfile + names + DOB + address + individual profile)
   * inside the given batch (sanctionedEntityId), within the given transaction manager
   */
  private async createEntryProfile(
    manager: EntityManager,
    sanctionedEntityId: string,
    data: any,
  ): Promise<EntityProfile> {
    // Build fullName from name parts if not directly provided
    const fullName = data.fullName
      || [data.name1, data.name2, data.name3, data.name4, data.name5, data.name6]
          .filter((n: string) => n && String(n).trim())
          .join(' ')
      || 'Unknown';

    // Build a sanitized rawData snapshot preserving every original field
    const rawData: Record<string, any> = {
      name1: data.name1 || '', name2: data.name2 || '', name3: data.name3 || '',
      name4: data.name4 || '', name5: data.name5 || '', name6: data.name6 || '',
      title: data.title || '',
      nameNonLatin: data.nameNonLatin || '', nonLatinType: data.nonLatinType || '', nonLatinLang: data.nonLatinLang || '',
      dob: data.dob ? String(data.dob) : '',
      townOfBirth: data.townOfBirth || data.placeOfBirth || '',
      countryOfBirth: data.countryOfBirth || '',
      nationality: data.nationality || data.country || '',
      passportNum: data.passportNum || data.passportNumber || '',
      passportDetails: data.passportDetails || '',
      nationalId: data.nationalId || data.nationalIdNumber || '',
      nationalIdDetails: data.nationalIdDetails || '',
      addr1: data.addr1 || (data.addresses?.[0]) || '',
      addr2: data.addr2 || (data.addresses?.[1]) || '',
      addr3: data.addr3 || (data.addresses?.[2]) || '',
      addr4: data.addr4 || '', addr5: data.addr5 || '', addr6: data.addr6 || '',
      zipCode: data.zipCode || '',
      country: data.country || '',
      otherInfo: data.otherInfo || data.otherInformation || '',
      groupType: data.groupType || '',
      aliasType: data.aliasType || data.alias || '',
      aliasQuality: data.aliasQuality || '',
      regime: data.regime || '',
      listedOn: data.listedOn || '',
      ukSanctionsListDate: data.ukSanctionsListDate || '',
      lastUpdated: data.lastUpdated || '',
      groupId: data.groupId || '',
      fullName,
    };

    // 1. EntityProfile (the "entry" / person row)
    const profile = manager.create(EntityProfile, {
      sanctionedEntityId,
      entityType: this.mapGroupType(data.groupType),
      fullName: String(fullName),
      alias: data.alias || data.aliasType || null,
      dateOfBirth: data.dob ? String(data.dob) : null,
      nationality: data.nationality || data.country || null,
      groupId: data.groupId ? parseInt(String(data.groupId), 10) || null : null,
      listedOn: data.listedOn || data.ukSanctionsListDate || null,
      otherInformation: data.otherInfo || data.otherInformation || null,
      rawData,
    });
    const savedProfile = await manager.save(profile);

    // 2. Primary Name
    const primaryName = manager.create(EntityName, {
      entityProfileId: savedProfile.id,
      name: String(fullName),
      nameType: NameTypeEnum.PRIMARY_NAME,
      isPrimary: true,
    });
    await manager.save(primaryName);

    // 3. Alias name
    const aliasValue = data.alias || data.aliasType;
    if (aliasValue) {
      const aliasName = manager.create(EntityName, {
        entityProfileId: savedProfile.id,
        name: String(aliasValue),
        nameType: NameTypeEnum.AKA,
        isPrimary: false,
      });
      await manager.save(aliasName);
    }

    // 4. Non-Latin name
    if (data.nameNonLatin) {
      const nlName = manager.create(EntityName, {
        entityProfileId: savedProfile.id,
        name: String(data.nameNonLatin),
        nameType: NameTypeEnum.PRIMARY_NAME_VARIATION,
        isPrimary: false,
      });
      await manager.save(nlName);
    }

    // 5. Date of Birth
    const dob = data.dob || data.dateOfBirth;
    if (dob) {
      const dobEntry = manager.create(EntityDateOfBirth, {
        entityProfileId: savedProfile.id,
        dateOfBirth: String(dob),
      });
      await manager.save(dobEntry);
    }

    // 6. Individual Profile (demographics)
    const nat = data.nationality || data.country;
    const pob = data.placeOfBirth || data.townOfBirth || data.countryOfBirth;
    const passport = data.passportNum || data.passportNumber;
    const natId = data.nationalId || data.nationalIdNumber;
    if (nat || pob || passport || natId) {
      const indProfile = manager.create(IndividualProfile, {
        entityProfileId: savedProfile.id,
        nationality: nat ? String(nat) : null,
        placeOfBirth: pob ? String(pob) : null,
        passportNumber: passport ? String(passport) : null,
        passportDetails: data.passportDetails ? String(data.passportDetails) : null,
        nationalIdNumber: natId ? String(natId) : null,
        nationalIdDetails: data.nationalIdDetails ? String(data.nationalIdDetails) : null,
      });
      await manager.save(indProfile);
    }

    // 7. Address
    const addrFields = [data.addr1, data.addr2, data.addr3, data.addr4, data.addr5, data.addr6];
    const validAddrs = (data.addresses || addrFields).filter(
      (a: string) => a && String(a).trim().length > 0,
    );
    if (validAddrs.length > 0) {
      const address = manager.create(EntityAddress, {
        entityProfileId: savedProfile.id,
        addressType: AddressTypeEnum.CORRESPONDENCE,
        addressLine1: String(validAddrs[0]),
        addressLine2: validAddrs[1] ? String(validAddrs[1]) : null,
        addressLine3: validAddrs[2] ? String(validAddrs[2]) : null,
        city: validAddrs[3] ? String(validAddrs[3]) : null,
        state: validAddrs[4] ? String(validAddrs[4]) : null,
        postalCode: data.zipCode ? String(data.zipCode) : null,
        country: (data.country || nat) ? String(data.country || nat) : null,
      });
      await manager.save(address);
    }

    return savedProfile;
  }

  /** Map frontend groupType string to EntityTypeEnum */
  private mapGroupType(groupType?: string): EntityTypeEnum {
    if (!groupType) return EntityTypeEnum.INDIVIDUAL;
    const upper = String(groupType).toUpperCase();
    if (upper.includes('ORG') || upper.includes('ENTITY')) return EntityTypeEnum.ORGANIZATION;
    if (upper.includes('VESSEL') || upper.includes('SHIP')) return EntityTypeEnum.VESSEL;
    return EntityTypeEnum.INDIVIDUAL;
  }

  /** Convert Excel serial date numbers (e.g. 43753) to ISO date strings, or pass strings through */
  private parseExcelDate(value: any): string | null {
    if (!value) return null;
    if (typeof value === 'number') {
      // Excel serial date: days since 1900-01-00 (with the 1900 leap year bug)
      const excelEpoch = new Date(1899, 11, 30); // Dec 30, 1899
      const date = new Date(excelEpoch.getTime() + value * 86400000);
      return date.toISOString().split('T')[0];
    }
    return String(value);
  }

  /** Flatten an EntityProfile + relations into the flat column format the frontend ViewEntriesModal expects */
  private flattenProfile(p: EntityProfile): Record<string, any> {
    const raw = p.rawData || {} as Record<string, any>;

    // If rawData exists, use it directly — it preserves exact column positions
    // Otherwise fall back to relational data
    const ind = p.individualProfile;
    const addr = p.addresses?.[0];
    const dob = p.datesOfBirth?.[0];
    const aliasName = p.names?.find((n) => n.nameType === NameTypeEnum.AKA);
    const nlName = p.names?.find((n) => n.nameType === NameTypeEnum.PRIMARY_NAME_VARIATION);

    return {
      id: p.id,
      name1: raw.name1 || '',
      name2: raw.name2 || '',
      name3: raw.name3 || '',
      name4: raw.name4 || '',
      name5: raw.name5 || '',
      name6: raw.name6 || '',
      title: raw.title || '',
      nameNonLatin: raw.nameNonLatin || nlName?.name || '',
      nonLatinType: raw.nonLatinType || '',
      nonLatinLang: raw.nonLatinLang || '',
      dob: raw.dob || dob?.dateOfBirth || p.dateOfBirth || '',
      townOfBirth: raw.townOfBirth || ind?.placeOfBirth || '',
      countryOfBirth: raw.countryOfBirth || '',
      nationality: raw.nationality || ind?.nationality || p.nationality || '',
      passportNum: raw.passportNum || ind?.passportNumber || '',
      passportDetails: raw.passportDetails || ind?.passportDetails || '',
      nationalId: raw.nationalId || ind?.nationalIdNumber || '',
      nationalIdDetails: raw.nationalIdDetails || ind?.nationalIdDetails || '',
      addr1: raw.addr1 || addr?.addressLine1 || '',
      addr2: raw.addr2 || addr?.addressLine2 || '',
      addr3: raw.addr3 || addr?.addressLine3 || '',
      addr4: raw.addr4 || addr?.city || '',
      addr5: raw.addr5 || addr?.state || '',
      addr6: raw.addr6 || '',
      zipCode: raw.zipCode || addr?.postalCode || '',
      country: raw.country || addr?.country || '',
      otherInfo: raw.otherInfo || p.otherInformation || '',
      groupType: raw.groupType || p.entityType || '',
      aliasType: raw.aliasType || aliasName?.name || p.alias || '',
      aliasQuality: raw.aliasQuality || '',
      regime: raw.regime || '',
      listedOn: raw.listedOn || p.listedOn || '',
      ukSanctionsListDate: raw.ukSanctionsListDate || '',
      lastUpdated: raw.lastUpdated || p.updatedAt?.toISOString?.()?.split('T')?.[0] || '',
      groupId: raw.groupId || p.groupId || '',
      fullName: raw.fullName || p.fullName || '',
      evidenceDocuments: p.evidenceDocuments || [],
      errors: raw.errors || [],
    };
  }

  private assertValidStatusTransition(
    current: BlacklistStatusEnum,
    next: BlacklistStatusEnum,
  ) {
    const allowedTransitions: Record<
      BlacklistStatusEnum,
      BlacklistStatusEnum[]
    > = {
      [BlacklistStatusEnum.PENDING]: [
        BlacklistStatusEnum.READY,
        BlacklistStatusEnum.PROCESSING,
      ],
      [BlacklistStatusEnum.READY]: [
        BlacklistStatusEnum.VALID,
        BlacklistStatusEnum.ERRONEOUS,
        BlacklistStatusEnum.PROCESSING,
      ],
      [BlacklistStatusEnum.PROCESSING]: [
        BlacklistStatusEnum.VALID,
        BlacklistStatusEnum.ERRONEOUS,
      ],
      [BlacklistStatusEnum.VALID]: [
        BlacklistStatusEnum.ERRONEOUS,
        BlacklistStatusEnum.READY,
      ],
      [BlacklistStatusEnum.ERRONEOUS]: [
        BlacklistStatusEnum.VALID,
        BlacklistStatusEnum.READY,
      ],
    };

    const allowed = allowedTransitions[current] || [];
    if (!allowed.includes(next)) {
      throw new BadRequestException(
        `Invalid status transition: ${current} -> ${next}`,
      );
    }
  }
}
