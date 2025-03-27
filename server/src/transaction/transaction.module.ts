import { Module, forwardRef } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { Transaction } from './entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './transaction.service';
import { CoinModule } from 'src/coin/coin.module';
import { PortfolioCoinModule } from 'src/portfolio_coin/portfolio_coin.module';
import { PortfolioModule } from 'src/portfolio/portfolio.module';

@Module({  
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    forwardRef(() => PortfolioModule),
    CoinModule,
    PortfolioCoinModule
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
