import { Injectable } from '@nestjs/common';
import * as xlsx from 'xlsx';

@Injectable()
export class FormatService {
  /**
   * Generates a JSON string
   */
  toJSON(batch: any, entries: any[]): { content: string; contentType: string; extension: string } {
    return {
      content: JSON.stringify({ batch, entries }, null, 2),
      contentType: 'application/json',
      extension: 'json',
    };
  }

  /**
   * Generates a simple XML string
   */
  toXML(batch: any, entries: any[]): { content: string; contentType: string; extension: string } {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sanctions_batch>\n`;
    xml += `  <metadata>\n`;
    xml += `    <id>${batch.id}</id>\n`;
    xml += `    <source>${this.escapeXml(batch.source)}</source>\n`;
    xml += `    <date>${batch.date}</date>\n`;
    xml += `  </metadata>\n`;
    xml += `  <entries>\n`;

    for (const entry of entries) {
      xml += `    <entry>\n`;
      for (const [key, value] of Object.entries(entry)) {
        if (value !== null && value !== undefined && key !== 'evidenceDocuments' && key !== 'errors') {
          xml += `      <${key}>${this.escapeXml(String(value))}</${key}>\n`;
        }
      }
      xml += `    </entry>\n`;
    }

    xml += `  </entries>\n</sanctions_batch>`;

    return {
      content: xml,
      contentType: 'application/xml',
      extension: 'xml',
    };
  }

  /**
   * Generates an Excel buffer
   */
  toExcel(batch: any, entries: any[]): { content: Buffer; contentType: string; extension: string } {
    const worksheet = xlsx.utils.json_to_sheet(entries);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sanctions List');
    
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    return {
      content: buffer,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      extension: 'xlsx',
    };
  }

  /**
   * Generates HMT (UK Treasury) formatted Excel buffer
   * This uses specific column names and ordering
   */
  toHMT(batch: any, entries: any[]): { content: Buffer; contentType: string; extension: string } {
    // Mapping internal fields to HMT specific column names
    const hmtData = entries.map(e => ({
      'Name 1': e.name1 || '',
      'Name 2': e.name2 || '',
      'Name 3': e.name3 || '',
      'Name 4': e.name4 || '',
      'Name 5': e.name5 || '',
      'Name 6': e.name6 || '',
      'Title': e.title || '',
      'Name Non-Latin': e.nameNonLatin || '',
      'DOB': e.dob || '',
      'Town of Birth': e.townOfBirth || '',
      'Country of Birth': e.countryOfBirth || '',
      'Nationality': e.nationality || '',
      'Passport Details': e.passportDetails || e.passportNum || '',
      'NI Number': e.nationalId || '',
      'Position': e.title || '', // Often mapped to position
      'Address 1': e.addr1 || '',
      'Address 2': e.addr2 || '',
      'Address 3': e.addr3 || '',
      'Address 4': e.addr4 || '',
      'Address 5': e.addr5 || '',
      'Address 6': e.addr6 || '',
      'Postcode': e.zipCode || '',
      'Country': e.country || '',
      'Other Information': e.otherInfo || '',
      'Group Type': e.groupType || '',
      'Alias Type': e.aliasType || '',
      'Regime': e.regime || '',
      'Listed On': e.listedOn || '',
      'Last Updated': e.lastUpdated || '',
      'Group ID': e.groupId || '',
    }));

    const worksheet = xlsx.utils.json_to_sheet(hmtData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'HMT Sanctions List');
    
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    return {
      content: buffer,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      extension: 'xlsx',
    };
  }

  /**
   * Generates a custom JSON mapped payload
   */
  toCustom(batch: any, entries: any[], mapping: Record<string, string>): { content: string; contentType: string; extension: string } {
    if (!mapping || Object.keys(mapping).length === 0) {
      return this.toJSON(batch, entries);
    }

    const customEntries = entries.map(entry => {
      const newEntry: Record<string, any> = {};
      for (const [externalLabel, internalKey] of Object.entries(mapping)) {
        newEntry[externalLabel] = entry[internalKey] || '';
      }
      return newEntry;
    });

    return {
      content: JSON.stringify({ batch, entries: customEntries }, null, 2),
      contentType: 'application/json',
      extension: 'json',
    };
  }

  private escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }
}
