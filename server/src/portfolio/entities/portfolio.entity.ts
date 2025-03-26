import { PortfolioCoin } from 'src/portfolio_coin/entities/portfolio_coin.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne, OneToMany, JoinTable, ManyToMany } from 'typeorm';

@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  bestPerformerCoinId: number;

  @Column({ nullable: true })
  worstPerformerCoinId: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, nullable: true })
  allTimeProfit: number;
  
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, nullable: true })
  balance: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.portfolio)
  @JoinColumn()
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.portfolio)
  transactions: Transaction[];

  @OneToMany(() => PortfolioCoin, (portfolioCoin) => portfolioCoin.portfolio)
  portfolioCoins: PortfolioCoin[];
}