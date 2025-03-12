import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pgConfig } from 'dbConfig';
import { PortfolioModule } from './portfolio/portfolio.module';
import { TransactionController } from './transaction/transaction.controller';
import { TransactionModule } from './transaction/transaction.module';
import { CoinController } from './coin/coin.controller';
import { CoinModule } from './coin/coin.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forRoot(pgConfig), PortfolioModule, TransactionModule, CoinModule],
  controllers: [AppController, TransactionController, CoinController],
  providers: [AppService],
})
export class AppModule {}
