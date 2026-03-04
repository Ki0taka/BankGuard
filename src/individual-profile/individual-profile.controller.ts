import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IndividualProfileService } from './individual-profile.service';
import { CreateIndividualProfileDto } from './dto/create-individual-profile.dto';
import { UpdateIndividualProfileDto } from './dto/update-individual-profile.dto';

@Controller('individual-profile')
export class IndividualProfileController {
  constructor(private readonly individualProfileService: IndividualProfileService) {}

  @Post()
  create(@Body() createIndividualProfileDto: CreateIndividualProfileDto) {
    return this.individualProfileService.create(createIndividualProfileDto);
  }

  @Get()
  findAll() {
    return this.individualProfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.individualProfileService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIndividualProfileDto: UpdateIndividualProfileDto) {
    return this.individualProfileService.update(id, updateIndividualProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.individualProfileService.remove(id);
  }
}
