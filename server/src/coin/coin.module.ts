import { Module } from '@nestjs/common';
import { Coin } from './entities/coin.entity';
import { CoinController } from './coin.controller';
import { CoinService } from './services/coin.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Coin])],
  controllers: [CoinController],
  providers: [CoinService],
  exports: [CoinService],
})
export class CoinModule {}
