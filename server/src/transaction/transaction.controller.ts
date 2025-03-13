import { Controller, Get, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { PaginationDto } from './dto/pagination.dto';
import { take } from 'rxjs';

@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.transactionService.findAll(paginationDto);
  }
}
