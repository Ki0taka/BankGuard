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
import { ConfigService } from '@nestjs/config';
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
import axios from 'axios';
import { UrlHelper } from '../common/utils/url-helper';
import * as crypto from 'crypto';
import { drive_v3, google } from 'googleapis';

type UploadedFile = {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
  size: number;
};

@Injectable()
export class SanctionedEntityService {
  private readonly logger = new Logger(SanctionedEntityService.name);

  constructor(
    private readonly sanctionedEntityRepository: SanctionedEntityRepository,
    private readonly auditLogService: AuditLogService,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
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

  private async generateSequentialId(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `BL-${year}-`;
    
    // Find the highest sequence number for the current year
    const lastEntity = await this.sanctionedEntityRepository
      .createQueryBuilder('entity')
      .where('entity.blacklistId LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('entity.blacklistId', 'DESC')
      .getOne();

    let sequence = 1;
    if (lastEntity && lastEntity.blacklistId) {
      const parts = lastEntity.blacklistId.split('-');
      const lastNum = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(lastNum)) {
        sequence = lastNum + 1;
      }
    }

    return `${prefix}${String(sequence).padStart(4, '0')}`;
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
      entityType: entryData.entityType ? this.mapEntityType(entryData.entityType) : profile.entityType,
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

  private loadXlsx() {
    try {
      return require('xlsx');
    } catch {
      throw new BadRequestException(
        'Excel upload is unavailable because the xlsx package is not installed.',
      );
    }
  }

  async processExcelUpload(file: UploadedFile, metadata: any) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const xlsx = this.loadXlsx();
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    
    // 1. Calculate and verify hash
    const hash = crypto.createHash('sha256').update(file.buffer).digest('hex');
    const existing = await this.sanctionedEntityRepository.findOne({ where: { fileHash: hash }});
    if (existing) {
      throw new BadRequestException(`This file has already been uploaded as batch "${existing.blacklistId || existing.id}".`);
    }

    const sheetName = workbook.SheetNames[0];
    const datasheet = workbook.Sheets[sheetName];
    const rows: any[] = xlsx.utils.sheet_to_json(datasheet);

    if (!rows || rows.length === 0) {
      throw new BadRequestException('The uploaded file is empty.');
    }

    // 2. Strict Header Lockdown
    const firstRow = rows[0];
    const fileHeaders = Object.keys(firstRow);
    
    // Official Whitelist of supported patterns
    const SUPPORTED_PATTERNS = [
      'name', 'fullname', 'alias', 'aka', 'dob', 'nationality', 'country', 
      'birth', 'address', 'addr', 'location', 'group', 'listed', 'source',
      'passport', 'nationalid', 'id_number', 'zip', 'title', 'regime', 'sanction',
      'other', 'notes', 'registration', 'industry', 'gender', 'type', 'information',
      'emetteur', 'requisition', 'operation', 'date', 'client', 'lieu', 'position', 'language', 'script', 'updated'
    ];

    const unrecognized = fileHeaders.filter(header => {
      const norm = header.toLowerCase().replace(/[\s_-]/g, '');
      return !SUPPORTED_PATTERNS.some(p => norm.includes(p));
    });

    if (unrecognized.length > 0) {
      throw new BadRequestException(`Unrecognized columns found: "${unrecognized.join(', ')}". Please follow the official template.`);
    }

    const sequentialId = await this.generateSequentialId();

    const saved = await this.dataSource.transaction(async (manager) => {
      const createdById = (metadata.createdById && metadata.createdById.length > 20) ? metadata.createdById : null;

      // 1. Create ONE batch (SanctionedEntity)
      const batch = manager.create(SanctionedEntity, {
        source: String(metadata.source || 'Excel Upload'),
        blacklistId: String(metadata.blacklistId || sequentialId),
        fileHash: hash,
        status: (metadata.status || BlacklistStatusEnum.READY) as BlacklistStatusEnum,
        date: new Date().toISOString().split('T')[0],
        entriesCount: rows.length,
        createdById,
      });
      const savedBatch = await manager.save(batch);

      // 2. Create N entries (EntityProfiles) inside that batch
      try {
        let createdCount = 0;
        
        // Helper for fuzzy matching headers (e.g. FULL_NAME -> fullName)
        const val = (row: any, ...keys: string[]) => {
          const norm = (s: string) => s.toLowerCase().replace(/[\s_-]/g, '');
          const rowKeys = Object.keys(row);
          for (const target of keys) {
            const targetNorm = norm(target);
            const foundKey = rowKeys.find(rk => norm(rk) === targetNorm);
            if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null) {
               return row[foundKey];
            }
          }
          return null;
        };

        for (const row of rows) {
          const extractedFullName = val(row, 'fullName', 'full_name', 'Full Name', 'Name');
          const hmtNames = [
            val(row, 'Name 1', 'name1'), val(row, 'Name 2', 'name2'), 
            val(row, 'Name 3', 'name3'), val(row, 'Name 4', 'name4'), 
            val(row, 'Name 5', 'name5'), val(row, 'Name 6', 'name6')
          ];
          
          if (extractedFullName && !hmtNames[0]) {
             hmtNames[0] = extractedFullName;
          }
          
          const hasAnyName = extractedFullName || hmtNames.some(n => n && String(n).trim());

          // Skip rows with no names
          if (!hasAnyName) continue;

          createdCount++;
          const entryPayload = {
            fullName: extractedFullName ? String(extractedFullName) : undefined,
            alias: val(row, 'Alias', 'alias', 'AKA'),
            dob: this.parseExcelDate(val(row, 'DOB', 'date_of_birth', 'Date of Birth', 'DATE_NAISSANCE')),
            nationality: val(row, 'Nationality', 'country', 'Nationality_1'),
            placeOfBirth: val(row, 'PlaceOfBirth', 'Place of Birth', 'Town of Birth', 'LIEU_NAISSANCE'),
            townOfBirth: val(row, 'Town of Birth', 'place_of_birth', 'LIEU_NAISSANCE'),
            countryOfBirth: val(row, 'Country of Birth', 'countryOfBirth'),
            addresses: [val(row, 'Address', 'location')],
            groupId: val(row, 'GroupID', 'group_id', 'group_number'),
            listedOn: this.parseExcelDate(val(row, 'ListedOn', 'Listed On', 'DATE_REQUISITION')),
            otherInfo: val(row, 'OtherInfo', 'Other Information', 'Notes', 'OPERATION', 'Information', 'EMETTEUR'),
            passportNum: val(row, 'PassportNum', 'Passport Number', 'Passport'),
            nationalId: val(row, 'NationalId', 'National ID', 'ID_Number'),
            // Name parts
            name1: hmtNames[0], name2: hmtNames[1], name3: hmtNames[2],
            name4: hmtNames[3], name5: hmtNames[4], name6: hmtNames[5],
            title: val(row, 'Title', 'Position'),
            nameNonLatin: val(row, 'Name Non-Latin Script', 'Name Non-Latin'),
            nonLatinType: val(row, 'Non-Latin Script Type'),
            nonLatinLang: val(row, 'Non-Latin Script Language'),
            lastUpdated: val(row, 'Last Updated'),
            groupType: val(row, 'Group Type', 'TYPE_CLIENT'),
            registrationNumber: val(row, 'RegistrationNumber', 'ID_REQUISITION'),
          };

          // Data Density Check: Count how many fields we actually found
          const populatedCount = Object.values(entryPayload).filter(v => v !== null && v !== undefined && String(v).trim().length > 0).length;
          
          if (populatedCount < 3) {
            createdCount--; // roll back count
            this.logger.warn(`Skipping low-density row: ${extractedFullName || hmtNames[0] || 'Unknown'}`);
            continue;
          }
          
          await this.createEntryProfile(manager, savedBatch.id, entryPayload);
        }
        
        if (createdCount === 0) {
          throw new BadRequestException('The attributes in the file does not match the stuff we have');
        }

        // Update the actual count of entries created
        savedBatch.entriesCount = createdCount;
        await manager.save(savedBatch);
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
      metadata: { count: saved.entriesCount, source: metadata.source },
    });

    return saved;
  }

  async importFromUrl(url: string, metadata: any) {
    try {
      this.logger.log(`Importing blacklist from URL: ${url}`);
      
      // Handle Google Drive Folders
      if (url.includes('drive.google.com/drive/folders/')) {
        return this.handleDriveFolderImport(url, metadata);
      }

      const directUrl = UrlHelper.transformToDirectDownload(url);
      
      const response = await axios.get(directUrl, { responseType: 'arraybuffer' });
      const filename = url.split('/').pop() || 'cloud_import.xlsx';

      const file: UploadedFile = {
        originalname: filename,
        buffer: Buffer.from(response.data),
        mimetype: response.headers['content-type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: response.data.length,
      };

      return this.processExcelUpload(file, metadata);
    } catch (error) {
      this.logger.error(`Failed to import from URL ${url}: ${error.message}`);
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(`Cloud import failed: ${error.message}. Please ensure the URL is public and direct.`);
    }
  }

  private async handleDriveFolderImport(url: string, metadata: any) {
    const folderIdMatch = url.match(/folders\/([a-zA-Z0-9_-]+)/);
    if (!folderIdMatch) throw new BadRequestException('Invalid Google Drive folder URL');
    const folderId = folderIdMatch[1];

    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (!apiKey) {
      throw new BadRequestException('Google API Key is missing in server configuration. Folder import is unavailable.');
    }

    const drive = google.drive({ version: 'v3', auth: apiKey });
    
    try {
      const res = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false and (
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' or 
          mimeType = 'application/vnd.google-apps.spreadsheet' or 
          mimeType = 'application/vnd.ms-excel' or 
          mimeType = 'text/csv' or 
          mimeType = 'text/xml' or 
          mimeType = 'application/xml'
        )`,
        fields: 'files(id, name, mimeType)',
      });

      const files = res.data.files || [];
      if (files.length === 0) {
        throw new BadRequestException('No Excel or Google Spreadsheet files found in the provided folder.');
      }

      this.logger.log(`Found ${files.length} files in Drive folder. Starting batch import...`);
      
      const results = [];
      for (const driveFile of files) {
        try {
          // Export Google Sheets as Excel, or download binary for Excel files
          let mediaResponse;
          if (driveFile.mimeType === 'application/vnd.google-apps.spreadsheet') {
            mediaResponse = await drive.files.export({
              fileId: driveFile.id,
              mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }, { responseType: 'arraybuffer' });
          } else {
            mediaResponse = await drive.files.get({
              fileId: driveFile.id,
              alt: 'media',
            }, { responseType: 'arraybuffer' });
          }

          const file: UploadedFile = {
            originalname: driveFile.name,
            buffer: Buffer.from(mediaResponse.data),
            mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            size: mediaResponse.data.length,
          };

          const saved = await this.processExcelUpload(file, metadata);
          results.push({ name: driveFile.name, status: 'SUCCESS', id: saved.id });
        } catch (err) {
          this.logger.error(`Failed to import file ${driveFile.name} from folder: ${err.message}`);
          results.push({ name: driveFile.name, status: 'FAILED', error: err.message });
        }
      }

      return {
        message: `Processed folder import: ${results.filter(r => r.status === 'SUCCESS').length} succeeded, ${results.filter(r => r.status === 'FAILED').length} failed.`,
        details: results,
      };
    } catch (err) {
      throw new BadRequestException(`Failed to list Drive folder: ${err.message}`);
    }
  }

  async bulkCreate(payload: { source: string; blacklistId?: string; entries: any[]; createdById?: string }) {
    const { source, blacklistId, entries, createdById } = payload;

    const validCreatedById = (createdById && createdById.length > 20) ? createdById : null;
    const normalizedBlacklistId = blacklistId ? String(blacklistId).trim() : '';
    const resolvedBlacklistId = normalizedBlacklistId || await this.generateSequentialId();

    const saved = await this.dataSource.transaction(async (manager) => {
      // 1. Create ONE batch (SanctionedEntity)
      const batch = manager.create(SanctionedEntity, {
        source: String(source),
        blacklistId: resolvedBlacklistId,
        status: BlacklistStatusEnum.READY,
        date: new Date().toISOString().split('T')[0],
        entriesCount: entries.length,
        createdById: validCreatedById,
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
      metadata: { count: entries.length, source, blacklistId: resolvedBlacklistId },
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
      registrationNumber: data.registrationNumber || '',
      registrationCountry: data.registrationCountry || '',
      incorporationDate: data.incorporationDate || '',
      industry: data.industry || '',
      entityType: data.entityType || this.mapGroupType(data.groupType),
      fullName,
    };

    const entityType = data.entityType ? this.mapEntityType(data.entityType) : this.mapGroupType(data.groupType);

    // 1. EntityProfile (the "entry" / person row)
    const profile = manager.create(EntityProfile, {
      sanctionedEntityId,
      entityType,
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

    // 6b. Organization Profile
    const regNum = data.registrationNumber;
    const regCountry = data.registrationCountry || data.country;
    const incDate = data.incorporationDate;
    const industry = data.industry;
    if (entityType === EntityTypeEnum.ORGANIZATION || regNum || industry) {
      if (incDate && String(incDate).trim().length > 0) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(String(incDate)) || isNaN(Date.parse(String(incDate)))) {
          throw new BadRequestException(`Invalid date format for incorporationDate: "${incDate}". Expected YYYY-MM-DD.`);
        }
      }
      const orgRepo = manager.getRepository('OrganizationProfile'); // Use string lookup to avoid circular ref if not imported
      const orgProfile = manager.create('OrganizationProfile', {
        entityProfileId: savedProfile.id,
        registrationNumber: regNum ? String(regNum) : null,
        registrationCountry: regCountry ? String(regCountry) : null,
        incorporationDate: incDate ? String(incDate) : null,
        industry: industry ? String(industry) : null,
      });
      await manager.save('OrganizationProfile', orgProfile);
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

  /** Map frontend entityType string to EntityTypeEnum */
  private mapEntityType(entityType?: string): EntityTypeEnum {
    if (!entityType) return EntityTypeEnum.INDIVIDUAL;
    const upper = String(entityType).toUpperCase();
    if (upper === 'IND' || upper === 'INDIVIDUAL') return EntityTypeEnum.INDIVIDUAL;
    if (upper === 'ORG' || upper.includes('ORGANIZATION') || upper.includes('COMPANY')) return EntityTypeEnum.ORGANIZATION;
    if (upper === 'VESSEL' || upper.includes('SHIP')) return EntityTypeEnum.VESSEL;
    return EntityTypeEnum.INDIVIDUAL;
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
      registrationNumber: raw.registrationNumber || p.organizationProfile?.registrationNumber || '',
      registrationCountry: raw.registrationCountry || p.organizationProfile?.registrationCountry || '',
      incorporationDate: raw.incorporationDate || p.organizationProfile?.incorporationDate || '',
      industry: raw.industry || p.organizationProfile?.industry || '',
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
