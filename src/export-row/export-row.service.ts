import { Injectable } from '@nestjs/common';
import { ExportRowRepository } from './export-row.repository';
import { CreateExportRowDto } from './dto/create-export-row.dto';
import { UpdateExportRowDto } from './dto/update-export-row.dto';

@Injectable()
export class ExportRowService {
  constructor(private readonly exportRowRepository: ExportRowRepository) {}

  create(createExportRowDto: CreateExportRowDto) {
    return 'This action adds a new exportRow';
  }

  findAll() {
    return `This action returns all exportRow`;
  }

  findOne(id: string) {
    return `This action returns a #exportRow id`;
  }

  update(id: string, updateExportRowDto: UpdateExportRowDto) {
    return `This action updates a #exportRow id`;
  }

  remove(id: string) {
    return `This action removes a #exportRow id`;
  }
}
