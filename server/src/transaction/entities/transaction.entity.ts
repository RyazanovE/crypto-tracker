import { Coin } from 'src/coin/entities/coin.entity';
import { Portfolio } from 'src/portfolio/entities/portfolio.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

export enum TransactionType {
  BUY = 'buy',
  SELL = 'sell',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TransactionType})
  type: TransactionType;

  @Column('numeric', { precision: 20, scale: 8})
  amount: number;

  @Column('numeric', { precision: 20, scale: 8})
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.transactions)
  portfolio: Portfolio

  @ManyToOne(() => Coin, (coin) => coin.transactions)
  coin: Coin;
}