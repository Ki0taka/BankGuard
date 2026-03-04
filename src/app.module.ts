import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { RequisitionModule } from './requisition/requisition.module';
import { SanctionedEntityModule } from './sanctioned-entity/sanctioned-entity.module';
import { EntityNameModule } from './entity-name/entity-name.module';
import { EntityDateOfBirthModule } from './entity-date-of-birth/entity-date-of-birth.module';
import { EntityAddressModule } from './entity-address/entity-address.module';
import { EntityStatusModule } from './entity-status/entity-status.module';
import { EntityProfileModule } from './entity-profile/entity-profile.module';
import { IndividualProfileModule } from './individual-profile/individual-profile.module';
import { OrganizationProfileModule } from './organization-profile/organization-profile.module';
import { VesselProfileModule } from './vessel-profile/vessel-profile.module';
import { EntityBankAccountModule } from './entity-bank-account/entity-bank-account.module';
import { EvidenceDocumentModule } from './evidence-document/evidence-document.module';
import { ExportJobModule } from './export-job/export-job.module';
import { ExportRowModule } from './export-row/export-row.module';
import { ExternalSourceModule } from './external-source/external-source.module';
import { SyncRunModule } from './sync-run/sync-run.module';
import { SyncedEntityModule } from './synced-entity/synced-entity.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { AggregateSnapshotModule } from './aggregate-snapshot/aggregate-snapshot.module';

@Module({
  imports: [
    RoleModule,
    UserModule,
    RequisitionModule,
    SanctionedEntityModule,
    EntityNameModule,
    EntityDateOfBirthModule,
    EntityAddressModule,
    EntityStatusModule,
    EntityProfileModule,
    IndividualProfileModule,
    OrganizationProfileModule,
    VesselProfileModule,
    EntityBankAccountModule,
    EvidenceDocumentModule,
    ExportJobModule,
    ExportRowModule,
    ExternalSourceModule,
    SyncRunModule,
    SyncedEntityModule,
    AuditLogModule,
    AggregateSnapshotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
