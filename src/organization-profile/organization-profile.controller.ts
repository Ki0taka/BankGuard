import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrganizationProfileService } from './organization-profile.service';
import { CreateOrganizationProfileDto } from './dto/create-organization-profile.dto';
import { UpdateOrganizationProfileDto } from './dto/update-organization-profile.dto';

@Controller('organization-profile')
export class OrganizationProfileController {
  constructor(private readonly organizationProfileService: OrganizationProfileService) {}

  @Post()
  create(@Body() createOrganizationProfileDto: CreateOrganizationProfileDto) {
    return this.organizationProfileService.create(createOrganizationProfileDto);
  }

  @Get()
  findAll() {
    return this.organizationProfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationProfileService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrganizationProfileDto: UpdateOrganizationProfileDto) {
    return this.organizationProfileService.update(id, updateOrganizationProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationProfileService.remove(id);
  }
}
