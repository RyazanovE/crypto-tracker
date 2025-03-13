import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { Transaction } from './entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './transaction.service';

@Module({  
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule {}
