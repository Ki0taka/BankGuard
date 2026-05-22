import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../common/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { SanctionedEntityService } from './sanctioned-entity.service';
import { AiExtractionService } from './ai-extraction.service';
import { CreateSanctionedEntityDto } from './dto/create-sanctioned-entity.dto';
import { UpdateSanctionedEntityDto } from './dto/update-sanctioned-entity.dto';

type UploadedFile = {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
  size: number;
};

@Controller('sanctioned-entity')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SanctionedEntityController {
  constructor(
    private readonly sanctionedEntityService: SanctionedEntityService,
    private readonly aiExtractionService: AiExtractionService,
  ) {}

  @Post('extract')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.DATA_ENTRY)
  async extract(@Body() payload: { text: string }) {
    return this.aiExtractionService.extractEntityInfo(payload.text);
  }

  // ── Batch-level CRUD ──

  @Post()
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.DATA_ENTRY)
  create(@Body() createSanctionedEntityDto: CreateSanctionedEntityDto) {
    return this.sanctionedEntityService.create(createSanctionedEntityDto);
  }

  @Post('bulk')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.DATA_ENTRY)
  bulkCreate(@Body() payload: { source: string; blacklistId?: string; entries: any[] }, @Request() req: any) {
    return this.sanctionedEntityService.bulkCreate({ ...payload, createdById: req.user.id });
  }

  @Get('stats')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  getStats() {
    return this.sanctionedEntityService.getStats();
  }

  @Get()
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.VERIFICATION, RoleEnum.DATA_ENTRY)
  findAll() {
    return this.sanctionedEntityService.findAll();
  }

  @Get('archived')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  findAllArchived() {
    return this.sanctionedEntityService.findAllArchived();
  }

  @Get(':id')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.VERIFICATION, RoleEnum.DATA_ENTRY)
  findOne(@Param('id') id: string) {
    return this.sanctionedEntityService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.DATA_ENTRY)
  update(
    @Param('id') id: string,
    @Body() updateSanctionedEntityDto: UpdateSanctionedEntityDto,
  ) {
    return this.sanctionedEntityService.update(id, updateSanctionedEntityDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.sanctionedEntityService.remove(id);
  }

  @Patch(':id/restore')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  restore(@Param('id') id: string) {
    return this.sanctionedEntityService.restore(id);
  }

  @Delete(':id/permanent')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  permanentDelete(@Param('id') id: string) {
    return this.sanctionedEntityService.permanentDelete(id);
  }

  @Post('upload')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.DATA_ENTRY)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: UploadedFile,
    @Body() metadata: any,
    @Request() req: any,
  ) {
    return this.sanctionedEntityService.processExcelUpload(file, { ...metadata, createdById: req.user.id });
  }

  @Post('import-url')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.DATA_ENTRY)
  importFromUrl(@Body() payload: { url: string } & any, @Request() req: any) {
    const { url, ...metadata } = payload;
    return this.sanctionedEntityService.importFromUrl(url, { ...metadata, createdById: req.user.id });
  }

  // ── Entry-level CRUD (EntityProfile inside a batch) ──

  @Get(':id/entries')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.VERIFICATION, RoleEnum.DATA_ENTRY)
  getEntries(@Param('id') id: string) {
    return this.sanctionedEntityService.getEntries(id);
  }

  @Post(':id/entries')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.DATA_ENTRY)
  addEntry(@Param('id') id: string, @Body() entryData: any) {
    return this.sanctionedEntityService.addEntry(id, entryData);
  }

  @Patch('entries/:entryId')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.DATA_ENTRY)
  updateEntry(@Param('entryId') entryId: string, @Body() entryData: any) {
    return this.sanctionedEntityService.updateEntry(entryId, entryData);
  }

  @Delete('entries/:entryId')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.DATA_ENTRY)
  deleteEntry(@Param('entryId') entryId: string) {
    return this.sanctionedEntityService.deleteEntry(entryId);
  }
}
