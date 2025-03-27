import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { PaginationDto } from './dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constants';
import { CreateTransactionDtoType } from './dto/create-transaction-dto';
import { CoinService } from 'src/coin/services/coin.service';
import { PortfolioService } from 'src/portfolio/portfolio.service';
import { PortfolioCoinService } from 'src/portfolio_coin/services/portfolio_coin.service';


@Injectable()
export class TransactionService {
  constructor(
    @Inject(forwardRef(() => PortfolioService)) private portfolioService: PortfolioService,
    private coinService: CoinService,
    private portfolioCoinService: PortfolioCoinService,
    @InjectRepository(Transaction) private transactionRepo: Repository<Transaction>
  ) {}
  
  async findAll(paginationDto?: PaginationDto) {
    return await this.transactionRepo.find(paginationDto ? {
      skip: paginationDto.skip,
      take: paginationDto.limit ?? DEFAULT_PAGE_SIZE,
      relations: ['coin'],
      order: { createdAt: 'DESC' }, 
    } : {
      relations: ['coin'],
      order: { createdAt: 'DESC' }, 
    });
  }

  async addTransaction(portfolioId: number, coinId: number, transaction: CreateTransactionDtoType) {
      return this.transactionRepo.save({ ...transaction, coin: { id: coinId }, portfolio: { id: portfolioId } });
  }

  async addTransactionAndUpdatePortfolio(userId: number, coinSymbol: string, transaction: CreateTransactionDtoType) {
    const coin = await this.coinService.getOrCreateCoin(coinSymbol);
    const portfolio = await this.portfolioService.getPortfolio(userId);

    if (portfolio?.id && coin?.id) {
      const createdTransaction = await this.addTransaction(portfolio.id, coin.id, transaction);
      await this.portfolioCoinService.updatePortfolioCoin(portfolio.id, coin.id, transaction);

      return { id: createdTransaction.id}
    }

  }

  async removeAllByCoinId(portfolioId: number, coinId: number) {
    return await this.transactionRepo.delete({ portfolio: { id: portfolioId }, coin: { id: coinId } })
  }
}