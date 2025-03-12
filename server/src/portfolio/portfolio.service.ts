import { Injectable } from '@nestjs/common';
import { Portfolio } from './entities/portfolio.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(@InjectRepository(Portfolio) private portfolioRepo: Repository<Portfolio>) {}
  
  async create(dto: CreatePortfolioDto) {
    return await this.portfolioRepo.save(dto);
  }
}