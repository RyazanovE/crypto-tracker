import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsSelect, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDtoType } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}


  async create(dto: CreateUserDtoType) {
    const user = await this.findByEmail(dto.email);
    if (user) throw new BadRequestException('User already exists'); 
    
    const userWithHashedPassword = await this.userRepo.create(dto);
    return await this.userRepo.save(userWithHashedPassword);
  }

  async updateHashedRefreshToken(userId: number, hashedRefreshToken?: string) {
    return await this.userRepo.update({ id: userId }, { hashedRefreshToken });
  }

  async findOne(id: number, withRefreshToken?: boolean) {
    const selectFields: FindOptionsSelect<User> = withRefreshToken
    ? { email: true, hashedRefreshToken: true, role: true, id: true }
    : { email: true, role: true, id: true, };

  const user = await this.userRepo.findOne({ where: { id }, select: selectFields });

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
