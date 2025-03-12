import { faker } from '@faker-js/faker';
import { Portfolio } from 'src/portfolio/entities/portfolio.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class MainSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const userFactory = factoryManager.get(User);

    console.log('seeding users...');
    const users = await userFactory.saveMany(10);

    console.log('seeding portfolios...');
    const portfolioFactory = factoryManager.get(Portfolio);
    const portfolios = await Promise.all(
      users.map(async (user) => {
        const portfolio = await portfolioFactory.make({user});
        return portfolio;
      })
    );
    const portfolioRepo = dataSource.getRepository(Portfolio);
    await portfolioRepo.save(portfolios);

    console.log('seeding transactions...');
    const transactionFactory = factoryManager.get(Transaction);
    const transactions = await Promise.all(
      Array(10).fill('').map(async () => {
        const transaction = await transactionFactory.make({ portfolio: faker.helpers.arrayElement(portfolios) });
        return transaction;
      })
    );
    const transactionRepo = dataSource.getRepository(Transaction);
    await transactionRepo.save(transactions);
  }
}
