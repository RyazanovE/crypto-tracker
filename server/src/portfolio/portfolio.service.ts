import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Portfolio } from './entities/portfolio.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { CoinService } from 'src/coin/services/coin.service';
import { PortfolioCoinService } from 'src/portfolio_coin/services/portfolio_coin.service';
import { TransactionService } from 'src/transaction/transaction.service';

@Injectable()
export class PortfolioService {
  constructor(    
    private coinService: CoinService,
    private portfolioCoinService: PortfolioCoinService,
    @Inject(forwardRef(() => TransactionService)) private transactionService: TransactionService,
    @InjectRepository(Portfolio) private portfolioRepo: Repository<Portfolio>,
  ) {}
  
  async create(dto: CreatePortfolioDto) {
    return await this.portfolioRepo.save(dto);
  }

  async getPortfolioWithCoins(userId: number) {
    const portfolio = await this.getPortfolio(userId);

    if (portfolio?.id) {
      const coins = await this.coinService.getPortfolioCoins(portfolio.id);
      const { balance, portfolioPofitLoss } = coins.reduce(
        (acc, coin) => {
          acc.balance += coin.usdtEquivalent;
          acc.portfolioPofitLoss += coin.profitLoss;
          return acc;
        },
        { balance: 0, portfolioPofitLoss: 0 }
      );
      
      const profitLossSortedCoins = coins.sort((a, b) => b.profitLoss - a.profitLoss)
      const bestPerformer = profitLossSortedCoins[0];
      const worstPerformer = profitLossSortedCoins[profitLossSortedCoins.length - 1];
      const portfolioChange = ((balance + portfolioPofitLoss) / balance - 1) * 100;

      const updatedPortfolio = { 
        ...portfolio, 
        coins, 
        bestPerformer,
        worstPerformer,
        balance, 
        portfolioChange,
        portfolioPofitLoss 
      };
      Object.keys(updatedPortfolio).forEach(key => {
        if (typeof updatedPortfolio[key] === "number") {
          updatedPortfolio[key] = Math.round(updatedPortfolio[key] * 100) / 100; 
        }
      });

      return updatedPortfolio
    }
  }

  async removeCoinFromPortfolio(userId: number, coinId: number) {
    const portfolio = await this.getPortfolio(userId);

    if (portfolio?.id) {
      await this.transactionService.removeAllByCoinId(portfolio.id, coinId);
      await this.portfolioCoinService.removePortfolioCoin(portfolio.id, coinId);
    }

    return { message: 'Successfully removed coin from portfolio' };
  }

  async getPortfolio(userId: number) {
    return await this.portfolioRepo.findOne({ where: { user: { id: userId } } });
  }
}