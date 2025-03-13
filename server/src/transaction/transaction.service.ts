import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { PaginationDto } from './dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constants';

@Injectable()
export class TransactionService {
  constructor(@InjectRepository(Transaction) private transactionRepo: Repository<Transaction>) {}
  
  async findAll(paginationDto: PaginationDto) {
    return await this.transactionRepo.find({
      skip: paginationDto.skip,
      take: paginationDto.limit ?? DEFAULT_PAGE_SIZE
    });
  }
}