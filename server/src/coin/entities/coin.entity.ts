import { PortfolioCoin } from 'src/portfolio_coin/entities/portfolio_coin.entity';
import { TransactionCoin } from 'src/transaction_coin/entities/transaction_coin.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class Coin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  sybmol: string;

  @OneToMany(() => PortfolioCoin, (portfolioCoin) => portfolioCoin.coin)
  portfolioCoins: PortfolioCoin[];

  @OneToMany(() => TransactionCoin, (transactionCoin) => transactionCoin.coin)
  transactionCoin: TransactionCoin[];
}