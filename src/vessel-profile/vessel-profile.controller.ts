import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VesselProfileService } from './vessel-profile.service';
import { CreateVesselProfileDto } from './dto/create-vessel-profile.dto';
import { UpdateVesselProfileDto } from './dto/update-vessel-profile.dto';

@Controller('vessel-profile')
export class VesselProfileController {
  constructor(private readonly vesselProfileService: VesselProfileService) {}

  @Post()
  create(@Body() createVesselProfileDto: CreateVesselProfileDto) {
    return this.vesselProfileService.create(createVesselProfileDto);
  }

  @Get()
  findAll() {
    return this.vesselProfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vesselProfileService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVesselProfileDto: UpdateVesselProfileDto,
  ) {
    return this.vesselProfileService.update(id, updateVesselProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vesselProfileService.remove(id);
  }
}
