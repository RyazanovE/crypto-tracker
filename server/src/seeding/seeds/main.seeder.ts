import { faker } from '@faker-js/faker';
import { Coin } from 'src/coin/entities/coin.entity';
import { Portfolio } from 'src/portfolio/entities/portfolio.entity';
import { PortfolioCoin } from 'src/portfolio_coin/entities/portfolio_coin.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

const COINS = [
  { name: 'Bitcoin', symbol: 'BTC' },
  { name: 'Ethereum', symbol: 'ETH' },
  { name: 'Solana', symbol: 'SOL' },
  { name: 'Avalanche', symbol: 'AVAX' },
  { name: 'Binance Coin', symbol: 'BNB' },
  { name: 'Cardano', symbol: 'ADA' },
  { name: 'Polkadot', symbol: 'DOT' },
  { name: 'Litecoin', symbol: 'LTC' },
  { name: 'Dogecoin', symbol: 'DOGE' },
  { name: 'Chainlink', symbol: 'LINK' }
];

export class MainSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    console.log('Seeding coins...');
    const coins = COINS.map(({name, symbol}) => {
      const coin = new Coin();
      coin.name = name;
      coin.symbol = symbol;
      return coin;
    })
    const coinRepository = dataSource.getRepository(Coin);
    await coinRepository.save(coins);
    
    console.log('seeding users...');
    const userFactory = factoryManager.get(User);
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
      [...Array(10)].map(async () => {
        const transaction = await transactionFactory.make({ portfolio: faker.helpers.arrayElement(portfolios), coin: faker.helpers.arrayElement(coins) });
        return transaction;
      })
    );
    const transactionRepo = dataSource.getRepository(Transaction);
    await transactionRepo.save(transactions);

    console.log('Seeding portfolio_coins...');
    const portfolioCoinRepository = dataSource.getRepository(PortfolioCoin);

    for (const portfolio of portfolios) {
      const selectedCoins = faker.helpers.arrayElements(coins, faker.number.int({ min: 1, max: 10 }));

      for (const coin of selectedCoins) {
        const portfolioCoin = new PortfolioCoin();
        portfolioCoin.portfolio = portfolio;
        portfolioCoin.coin = coin;
        portfolioCoin.amount = Number(faker.finance.amount({min: 0.01, max: 50000, dec: 8}));
        portfolioCoin.averagePrice = Number(faker.finance.amount({min: 0.01, max: 50000, dec: 8}));
        await portfolioCoinRepository.save(portfolioCoin);
      }
    }
  }
}
