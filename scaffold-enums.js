const fs = require('fs');
const path = require('path');

const enumsDir = path.join(__dirname, 'src', 'common', 'enums');
fs.mkdirSync(enumsDir, { recursive: true });

const enums = {
    'role.enum.ts': `export enum RoleEnum {\n  SUPER_ADMIN = 'SUPER_ADMIN',\n  ADMIN = 'ADMIN',\n  ACCOUNTS = 'ACCOUNTS',\n  COMPLIANCE = 'COMPLIANCE',\n  AUDITOR = 'AUDITOR',\n}\n`,
    'operation.enum.ts': `export enum OperationEnum {\n  GEL = 'GEL',\n  PROLONGATION = 'PROLONGATION',\n  DEMANDE_INFORMATION = 'DEMANDE_INFORMATION',\n}\n`,
    'list-type.enum.ts': `export enum ListTypeEnum {\n  INDCG = 'INDCG',\n  INDCI = 'INDCI',\n}\n`,
    'workflow-status.enum.ts': `export enum WorkflowStatusEnum {\n  PENDING = 'PENDING',\n  APPROVED = 'APPROVED',\n  REJECTED = 'REJECTED',\n}\n`,
    'entity-type.enum.ts': `export enum EntityTypeEnum {\n  INDIVIDUAL = 'INDIVIDUAL',\n  ORGANIZATION = 'ORGANIZATION',\n  VESSEL = 'VESSEL',\n}\n`,
    'status.enum.ts': `export enum StatusEnum {\n  ACTIVE = 'ACTIVE',\n  CLEARED = 'CLEARED',\n  EXPIRED = 'EXPIRED',\n  ESCALATED = 'ESCALATED',\n}\n`,
    'risk.enum.ts': `export enum RiskEnum {\n  LOW = 'LOW',\n  MEDIUM = 'MEDIUM',\n  HIGH = 'HIGH',\n  CRITICAL = 'CRITICAL',\n}\n`,
    'name-type.enum.ts': `export enum NameTypeEnum {\n  PRIMARY_NAME = 'PRIMARY_NAME',\n  AKA = 'AKA',\n  FKA = 'FKA',\n  PRIMARY_NAME_VARIATION = 'PRIMARY_NAME_VARIATION',\n}\n`,
    'quality.enum.ts': `export enum QualityEnum {\n  GOOD_QUALITY = 'GOOD_QUALITY',\n  LOW_QUALITY = 'LOW_QUALITY',\n  UNKNOWN = 'UNKNOWN',\n}\n`,
    'script.enum.ts': `export enum ScriptEnum {\n  LATIN = 'LATIN',\n  ARABIC = 'ARABIC',\n  CYRILLIC = 'CYRILLIC',\n  OTHER = 'OTHER',\n}\n`,
    'address-type.enum.ts': `export enum AddressTypeEnum {\n  REGISTERED = 'REGISTERED',\n  OPERATIONAL = 'OPERATIONAL',\n  RESIDENTIAL = 'RESIDENTIAL',\n  CORRESPONDENCE = 'CORRESPONDENCE',\n}\n`,
    'profile-type.enum.ts': `export enum ProfileTypeEnum {\n  INDIVIDUAL = 'INDIVIDUAL',\n  ORGANIZATION = 'ORGANIZATION',\n  VESSEL = 'VESSEL',\n}\n`,
    'gender.enum.ts': `export enum GenderEnum {\n  MALE = 'MALE',\n  FEMALE = 'FEMALE',\n  UNKNOWN = 'UNKNOWN',\n}\n`,
    'account-status.enum.ts': `export enum AccountStatusEnum {\n  FLAGGED = 'FLAGGED',\n  FROZEN = 'FROZEN',\n  CLOSED = 'CLOSED',\n}\n`,
    'doc-type.enum.ts': `export enum DocTypeEnum {\n  COURT_ORDER = 'COURT_ORDER',\n  FREEZE_ORDER = 'FREEZE_ORDER',\n  CORRESPONDENCE = 'CORRESPONDENCE',\n  SCREENSHOT = 'SCREENSHOT',\n  REPORT = 'REPORT',\n  OTHER = 'OTHER',\n}\n`,
    'format.enum.ts': `export enum FormatEnum {\n  XLSX = 'XLSX',\n  TXT = 'TXT',\n  CSV = 'CSV',\n  XML = 'XML',\n  PDF = 'PDF',\n}\n`,
    'job-status.enum.ts': `export enum JobStatusEnum {\n  PENDING = 'PENDING',\n  PROCESSING = 'PROCESSING',\n  COMPLETED = 'COMPLETED',\n  FAILED = 'FAILED',\n}\n`,
    'sync-status.enum.ts': `export enum SyncStatusEnum {\n  RUNNING = 'RUNNING',\n  SUCCESS = 'SUCCESS',\n  FAILED = 'FAILED',\n  PARTIAL = 'PARTIAL',\n}\n`,
    'sync-action.enum.ts': `export enum SyncActionEnum {\n  ADDED = 'ADDED',\n  UPDATED = 'UPDATED',\n  REMOVED = 'REMOVED',\n  UNCHANGED = 'UNCHANGED',\n}\n`
};

for (const [filename, content] of Object.entries(enums)) {
    fs.writeFileSync(path.join(enumsDir, filename), content);
}

console.log('Enums created successfully!');
