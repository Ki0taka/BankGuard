import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  findAll() {
    return `This action returns all role`;
  }

  findOne(id: string) {
    return `This action returns a #role id`;
  }

  update(id: string, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #role id`;
  }

  remove(id: string) {
    return `This action removes a #role id`;
  }
}
