import { Injectable } from '@nestjs/common';
import { ExportJobRepository } from './export-job.repository';
import { CreateExportJobDto } from './dto/create-export-job.dto';
import { UpdateExportJobDto } from './dto/update-export-job.dto';

@Injectable()
export class ExportJobService {
  constructor(private readonly exportJobRepository: ExportJobRepository) {}

  create(createExportJobDto: CreateExportJobDto) {
    return 'This action adds a new exportJob';
  }

  findAll() {
    return `This action returns all exportJob`;
  }

  findOne(id: string) {
    return `This action returns a #exportJob id`;
  }

  update(id: string, updateExportJobDto: UpdateExportJobDto) {
    return `This action updates a #exportJob id`;
  }

  remove(id: string) {
    return `This action removes a #exportJob id`;
  }
}
