import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: string) {
    return this.userRepository.findOneBy({ id } as any);
  }

  findOneBy(condition: any) {
    return this.userRepository.findOneBy(condition);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #user id`;
  }

  remove(id: string) {
    return `This action removes a #user id`;
  }
}
