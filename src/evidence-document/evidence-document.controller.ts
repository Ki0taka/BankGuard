import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EvidenceDocumentService } from './evidence-document.service';
import { CreateEvidenceDocumentDto } from './dto/create-evidence-document.dto';
import { UpdateEvidenceDocumentDto } from './dto/update-evidence-document.dto';

@Controller('evidence-document')
export class EvidenceDocumentController {
  constructor(private readonly evidenceDocumentService: EvidenceDocumentService) {}

  @Post()
  create(@Body() createEvidenceDocumentDto: CreateEvidenceDocumentDto) {
    return this.evidenceDocumentService.create(createEvidenceDocumentDto);
  }

  @Get()
  findAll() {
    return this.evidenceDocumentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evidenceDocumentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEvidenceDocumentDto: UpdateEvidenceDocumentDto) {
    return this.evidenceDocumentService.update(id, updateEvidenceDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.evidenceDocumentService.remove(id);
  }
}
