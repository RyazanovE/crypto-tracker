import { Injectable } from '@nestjs/common';
import { TransactionType } from 'src/transaction/entities/transaction.entity';
import { Repository } from 'typeorm';
import { PortfolioCoin } from '../entities/portfolio_coin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTransactionDtoType } from 'src/transaction/dto/create-transaction-dto';

@Injectable()
export class PortfolioCoinService {
  constructor(@InjectRepository(PortfolioCoin) private portfolioCoinRepo: Repository<PortfolioCoin>) {}
  
  async updatePortfolioCoin(
    portfolioId: number, 
    coinId: number, 
    { amount: transactionAmount, price: transactionPrice, type }: CreateTransactionDtoType
  ) {
    const portfolioCoin = await this.portfolioCoinRepo.findOne({
      where: { portfolio: { id: portfolioId }, coin: { id: coinId } },
    });
    const currentAmount = Number((portfolioCoin?.amount ?? 0))
    const updatedAmount = type === TransactionType.BUY ? currentAmount + transactionAmount : currentAmount - transactionAmount;
    const updatedAvgPrice = this.calculateWeightedAveragePrice(currentAmount, Number(portfolioCoin?.averagePrice ?? 0), transactionAmount, transactionPrice, type);

    if (portfolioCoin) {
      await this.portfolioCoinRepo.update(portfolioCoin.id, {
        amount: updatedAmount,
        averagePrice: updatedAvgPrice,
      });
    } else {
      await this.portfolioCoinRepo.save({
        portfolio: { id: portfolioId },
        coin: { id: coinId },
        amount: updatedAmount,
        averagePrice: updatedAvgPrice,
      });
    }
  }

  calculateWeightedAveragePrice(
    currentAmount: number,
    currentAvgPrice: number,
    newAmount: number,
    newPrice: number,
    type: TransactionType
  ) {
    if (type === TransactionType.BUY) {
      const totalValue = currentAmount * currentAvgPrice + newAmount * newPrice;
      const totalVolume = currentAmount + newAmount;
      return totalVolume === 0 ? 0 : totalValue / totalVolume;
    } else {
      return currentAvgPrice;
    }
  }

  async removePortfolioCoin(portfolioId: number, coinId: number) {
    await this.portfolioCoinRepo.delete({ portfolio: { id: portfolioId }, coin: { id: coinId } });
  }
}