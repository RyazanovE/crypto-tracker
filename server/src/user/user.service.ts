import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDtoType } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(dto: CreateUserDtoType) {
    const userWithHashedPassword = await this.userRepo.create(dto);
    return await this.userRepo.save(userWithHashedPassword);
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    return await this.userRepo.findOne({ where: { email } });
  }

  async findAll() {
    return await this.userRepo.find();
  }

  async update(id: number, dto: UpdateUserDto) {
    return await this.userRepo.update({ id }, dto);
  }

  async delete(id: number) {
    return await this.userRepo.delete({ id });
  }
}
