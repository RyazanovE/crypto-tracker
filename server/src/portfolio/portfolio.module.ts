import { Module, forwardRef } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { CoinModule } from 'src/coin/coin.module';
import { PortfolioCoinModule } from 'src/portfolio_coin/portfolio_coin.module';
import { PortfolioService } from './portfolio.service';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Portfolio]), 
    forwardRef(() => TransactionModule), 
    CoinModule, 
    PortfolioCoinModule
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
  exports: [PortfolioService],
})
export class PortfolioModule {}
