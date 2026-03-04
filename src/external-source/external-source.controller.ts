import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExternalSourceService } from './external-source.service';
import { CreateExternalSourceDto } from './dto/create-external-source.dto';
import { UpdateExternalSourceDto } from './dto/update-external-source.dto';

@Controller('external-source')
export class ExternalSourceController {
  constructor(private readonly externalSourceService: ExternalSourceService) {}

  @Post()
  create(@Body() createExternalSourceDto: CreateExternalSourceDto) {
    return this.externalSourceService.create(createExternalSourceDto);
  }

  @Get()
  findAll() {
    return this.externalSourceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.externalSourceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExternalSourceDto: UpdateExternalSourceDto) {
    return this.externalSourceService.update(id, updateExternalSourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.externalSourceService.remove(id);
  }
}
