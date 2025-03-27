import { Body, Controller, Get, Post, Query, Req, UsePipes } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { PaginationDto } from './dto/pagination.dto';
import { TransactionValidationPipe } from './pipes/transaction-validation-pipe';
import { CreateTransactionDtoType, CreateTransactionSchema } from './dto/create-transaction-dto';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.transactionService.findAll(paginationDto);
  }

  @UsePipes(new TransactionValidationPipe(CreateTransactionSchema))
  @Post()
  async create(@Body() body: CreateTransactionDtoType, @Req() req) {
    return this.transactionService.addTransactionAndUpdatePortfolio(req.user.id, body.symbol, body);
  }
}
