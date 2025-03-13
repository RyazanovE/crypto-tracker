import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioModule } from './portfolio/portfolio.module';
import { TransactionModule } from './transaction/transaction.module';
import { CoinModule } from './coin/coin.module';
import { AuthModule } from './auth/auth.module';
import dbConfig from './config/db.config';
import dbConfigProduction from './config/db.config.production';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [dbConfig, dbConfigProduction]
    }),
    UsersModule, 
    PortfolioModule, 
    TransactionModule, 
    CoinModule, 
    TypeOrmModule.forRootAsync({useFactory: process.env.NODE_ENV === 'production' ? dbConfigProduction : dbConfig}), 
    AuthModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

