import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExportRowService } from './export-row.service';
import { CreateExportRowDto } from './dto/create-export-row.dto';
import { UpdateExportRowDto } from './dto/update-export-row.dto';

@Controller('export-row')
export class ExportRowController {
  constructor(private readonly exportRowService: ExportRowService) {}

  @Post()
  create(@Body() createExportRowDto: CreateExportRowDto) {
    return this.exportRowService.create(createExportRowDto);
  }

  @Get()
  findAll() {
    return this.exportRowService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exportRowService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExportRowDto: UpdateExportRowDto,
  ) {
    return this.exportRowService.update(id, updateExportRowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exportRowService.remove(id);
  }
}
