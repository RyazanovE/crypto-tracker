import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';

@Module({})
export class TransactionModule {
  controllers: [TransactionController]
}
