import { Injectable } from '@nestjs/common';
import { RequisitionRepository } from './requisition.repository';
import { CreateRequisitionDto } from './dto/create-requisition.dto';
import { UpdateRequisitionDto } from './dto/update-requisition.dto';

@Injectable()
export class RequisitionService {
  constructor(private readonly requisitionRepository: RequisitionRepository) {}

  create(createRequisitionDto: CreateRequisitionDto) {
    return 'This action adds a new requisition';
  }

  findAll() {
    return `This action returns all requisition`;
  }

  findOne(id: string) {
    return `This action returns a #requisition id`;
  }

  update(id: string, updateRequisitionDto: UpdateRequisitionDto) {
    return `This action updates a #requisition id`;
  }

  remove(id: string) {
    return `This action removes a #requisition id`;
  }
}
