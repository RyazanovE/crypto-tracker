import { Portfolio } from 'src/portfolio/entities/portfolio.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: ['buy', 'sell'] })
  type: 'buy' |'sell';

  @Column('numeric', { precision: 20, scale: 8, nullable: false })
  amount: number;

  @Column('numeric', { precision: 20, scale: 8, nullable: false })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.transactions)
  portfolio: Portfolio
}