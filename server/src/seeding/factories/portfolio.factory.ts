import { Faker } from '@faker-js/faker';
import { Portfolio } from 'src/portfolio/entities/portfolio.entity';
import { setSeederFactory } from 'typeorm-extension';

export const PortfolioFactory = setSeederFactory(Portfolio, (faker: Faker) => {
  const portfolio = new Portfolio();
  
  portfolio.name = faker.company.name(); 
  portfolio.description = faker.lorem.sentence(); 
  portfolio.createdAt = faker.date.past();
  portfolio.updatedAt = faker.date.recent();

  return portfolio;
});
