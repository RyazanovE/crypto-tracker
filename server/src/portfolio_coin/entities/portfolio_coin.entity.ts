import { Coin } from 'src/coin/entities/coin.entity';
import { Portfolio } from 'src/portfolio/entities/portfolio.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

@Entity()
export class PortfolioCoin {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.portfolioCoins, { onDelete: 'CASCADE' })
  portfolio: Portfolio;

  @ManyToOne(() => Coin, (coin) => coin.portfolioCoins, { onDelete: 'CASCADE' })
  coin: Coin;

  @Column('numeric', { precision: 20, scale: 4, default: 0 })
  amount: number;

  @Column('numeric', { precision: 20, scale: 4, default: 0 })
  averagePrice: number;
}