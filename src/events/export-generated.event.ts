import { DomainEvent } from './domain-event';

export class ExportGeneratedEvent extends DomainEvent {
  exportJobId: string;
  rowCount: number;
  format: string;
  fileHash: string;

  getEventType(): string {
    return 'EXPORT_GENERATED';
  }

  getExportDetails(): Record<string, any> {
    return { exportJobId: this.exportJobId, rowCount: this.rowCount, format: this.format, fileHash: this.fileHash };
  }
}
