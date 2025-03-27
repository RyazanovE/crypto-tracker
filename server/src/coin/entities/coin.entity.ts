import { PortfolioCoin } from 'src/portfolio_coin/entities/portfolio_coin.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Coin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name?: string;

  @Column()
  symbol: string;

  @OneToMany(() => PortfolioCoin, (portfolioCoin) => portfolioCoin.coin)
  portfolioCoins: PortfolioCoin[];

  @OneToMany(() => Transaction, (transaction) => transaction.coin)
  transactions: Transaction[];
}