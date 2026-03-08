import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RequisitionService } from './requisition.service';
import { CreateRequisitionDto } from './dto/create-requisition.dto';
import { UpdateRequisitionDto } from './dto/update-requisition.dto';

@Controller('requisition')
export class RequisitionController {
  constructor(private readonly requisitionService: RequisitionService) {}

  @Post()
  create(@Body() createRequisitionDto: CreateRequisitionDto) {
    return this.requisitionService.create(createRequisitionDto);
  }

  @Get()
  findAll() {
    return this.requisitionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requisitionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRequisitionDto: UpdateRequisitionDto,
  ) {
    return this.requisitionService.update(id, updateRequisitionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requisitionService.remove(id);
  }
}
