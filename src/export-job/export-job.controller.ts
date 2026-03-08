import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExportJobService } from './export-job.service';
import { CreateExportJobDto } from './dto/create-export-job.dto';
import { UpdateExportJobDto } from './dto/update-export-job.dto';

@Controller('export-job')
export class ExportJobController {
  constructor(private readonly exportJobService: ExportJobService) {}

  @Post()
  create(@Body() createExportJobDto: CreateExportJobDto) {
    return this.exportJobService.create(createExportJobDto);
  }

  @Get()
  findAll() {
    return this.exportJobService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exportJobService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExportJobDto: UpdateExportJobDto,
  ) {
    return this.exportJobService.update(id, updateExportJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exportJobService.remove(id);
  }
}
