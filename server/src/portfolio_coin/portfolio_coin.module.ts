import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioCoinService } from './services/portfolio_coin.service';
import { PortfolioCoin } from './entities/portfolio_coin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PortfolioCoin])],
  controllers: [],
  providers: [PortfolioCoinService],
  exports: [PortfolioCoinService],
})
export class PortfolioCoinModule {}
