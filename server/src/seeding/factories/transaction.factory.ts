import { Faker } from '@faker-js/faker';
import { Transaction, TransactionType } from 'src/transaction/entities/transaction.entity';
import { setSeederFactory } from 'typeorm-extension';

export const TransactionFactory = setSeederFactory(Transaction, (faker: Faker) => {
  const transaction = new Transaction();

  transaction.type = faker.helpers.arrayElement([TransactionType.BUY, TransactionType.SELL]);
  transaction.amount = Number(faker.finance.amount({min: 0.01, max: 100, dec: 8}));
  transaction.price = Number(faker.finance.amount({min: 0.01, max: 50000, dec: 8}));
  transaction.createdAt = faker.date.recent();

  return transaction;
});
