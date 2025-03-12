import { Coin } from 'src/coin/entities/coin.entity';
import { Portfolio } from 'src/portfolio/entities/portfolio.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

@Entity()
export class TransactionCoin {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.transactionCoin, { onDelete: 'CASCADE' })
  portfolio: Portfolio;

  @ManyToOne(() => Coin, (coin) => coin.transactionCoin, { onDelete: 'CASCADE' })
  coin: Coin;

  @Column('numeric', { precision: 20, scale: 8, default: 0 })
  quantity: number;
}