import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coin } from '../entities/coin.entity';

@Injectable()
export class CoinService {
  constructor(@InjectRepository(Coin) private coinRepo: Repository<Coin>) {}

  private lastTimeBinanceDataUpdated: Date | null = null;

  private cachedBinanceData: {
      [k: string]: number;
  } | null = null;

  async getOrCreateCoin(symbol: string): Promise<Coin> {
    let coin = await this.coinRepo.findOne({ where: { symbol: symbol.toUpperCase() } });
    
    if (!coin) {
      coin = await this.coinRepo.save({ symbol: symbol.toUpperCase() });
    }
    return coin;
  }

  async getBinanceCoinsMap() {
    try {
      const isCashed = this.lastTimeBinanceDataUpdated && this.cachedBinanceData;

      if (isCashed) {
        const timeDiff = new Date().getTime() - this.lastTimeBinanceDataUpdated!.getTime();
        const oneMinute = 60 * 1000;
      
        if (timeDiff < oneMinute ) {
          return this.cachedBinanceData;
        } 
      }
      const result = await fetch(process.env.BINANCE_PRICE_URL as string);
      const coinsMap = Object.fromEntries(
        (await result.json() as { symbol: string; price: string }[])
        .filter((item) => item.symbol.endsWith('USDT'))
        .map(({ symbol, price }) => [symbol.replace('USDT', ''), Number(price)])
      );
      this.lastTimeBinanceDataUpdated = new Date();
      this.cachedBinanceData = coinsMap;
  
      return coinsMap;
    } catch (error) {
      console.error(error);
    }
  }

  async getPortfolioCoins(portfolioId: number) {
    const coins = await this.coinRepo.find({
      where: { portfolioCoins: { portfolio: { id: portfolioId } } },
      relations: ['portfolioCoins'],
    });
    const binanceCoinsMap = await this.getBinanceCoinsMap();

    return coins.map(({portfolioCoins, ...coin}) => {
      const portfolioCoinInfo = portfolioCoins[0];
      const averagePrice = parseFloat(portfolioCoinInfo.averagePrice as unknown as string);
      const amount = parseFloat(portfolioCoinInfo.amount as unknown as string)

      const moneySpent = averagePrice * amount;
      const currentPrice = binanceCoinsMap?.[coin.symbol] ?? 0;
      const usdtEquivalent = currentPrice * amount;
      const priceChange = ((currentPrice - averagePrice) / averagePrice) * 100;
      const profitLoss = usdtEquivalent - moneySpent;

      const updatedCoin = { 
        ...portfolioCoinInfo, 
        ...coin,
        amount,
        averagePrice,
        usdtEquivalent,
        profitLoss,
        priceChange,
        currentPrice,
        moneySpent
      }
      Object.keys(updatedCoin).forEach(key => {
        if (typeof updatedCoin[key] === "number") {
          updatedCoin[key] = Math.round(updatedCoin[key] * 100) / 100; 
        }
      });

      return updatedCoin
    });
  }
}