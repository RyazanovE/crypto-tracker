import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coin } from '../entities/coin.entity';

@Injectable()
export class CoinService {
  constructor(@InjectRepository(Coin) private coinRepo: Repository<Coin>) {}

  private lastTimeBinanceDataUpdated: Date | null = null;

  private cachedBinanceData: { symbol: string; price: string }[] | null = null;

  async getOrCreateCoin(symbol: string): Promise<Coin> {
    let coin = await this.coinRepo.findOne({ where: { symbol: symbol.toUpperCase() } });
    
    if (!coin) {
      coin = await this.coinRepo.save({ symbol: symbol.toUpperCase() });
    }
    return coin;
  }

  async getBinanceCoinsData() {
    try {
      const BINANCE_PRICE_URL = 'https://api.binance.com/api/v3/ticker/price';
      const result = await fetch(BINANCE_PRICE_URL);
      const parsedData = (await result.json()).filter((item) => item.symbol.endsWith('USDT')) as { symbol: string; price: string }[];

      if (this.lastTimeBinanceDataUpdated && this.cachedBinanceData) {
        const timeDiff = new Date().getTime() - this.lastTimeBinanceDataUpdated.getTime();
        const oneMinute = 60 * 60 * 1000;
      
        if (timeDiff < oneMinute ) {
          return this.cachedBinanceData;
        } 
      }
      this.lastTimeBinanceDataUpdated = new Date();
      this.cachedBinanceData = parsedData;
  
      return parsedData;
    } catch (error) {
      console.error(error);
    }
  }

  async getPortfolioCoins(portfolioId: number) {
    const coins = await this.coinRepo.find({
      where: { portfolioCoins: { portfolio: { id: portfolioId } } },
      relations: ['portfolioCoins'],
    });
    const binanceData = await this.getBinanceCoinsData();

    return coins.map(({portfolioCoins, ...coin}) => {
      const portfolioCoinInfo = {
        ...portfolioCoins[0], 
        averagePrice: Number(portfolioCoins[0]!.averagePrice).toFixed(2), 
        amount: Number(portfolioCoins[0]!.amount).toFixed(2)
      };
      const moneySpent = (portfolioCoins[0]!.averagePrice * portfolioCoins[0]!.amount);
      const currentPrice = binanceData?.find((item) => item.symbol.replace('USDT', '') === coin.symbol)?.price;
      const usdtEquivalent = Number(currentPrice) * Number(portfolioCoins[0]!.amount);
      let priceChange: number | undefined;
      let profitLoss: number | undefined;

      if (currentPrice) {
        const averageBuyingPrice = portfolioCoins[0]!.averagePrice;
        priceChange = ((Number(currentPrice) - averageBuyingPrice) / averageBuyingPrice) * 100;
        profitLoss = usdtEquivalent - moneySpent;
      }

      return { 
        ...portfolioCoinInfo, 
        ...coin,
        usdtEquivalent: usdtEquivalent ? Number(usdtEquivalent)?.toFixed(2) : undefined,
        profitLoss: profitLoss ? Number(profitLoss)?.toFixed(2) : undefined,
        priceChange: priceChange ? Number(priceChange)?.toFixed(2) : undefined,
        currentPrice: currentPrice ? Number(currentPrice)?.toFixed(2) :undefined,
        moneySpent: moneySpent.toFixed(2),
      }
    });
  }
}