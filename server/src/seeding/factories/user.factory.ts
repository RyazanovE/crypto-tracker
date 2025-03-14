import { Faker } from '@faker-js/faker';
import { User } from 'src/user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export const UserFactory = setSeederFactory(User, (faker: Faker) => {
  const user = new User();
  
  user.email = faker.internet.email();
  user.password = faker.internet.password();
  user.createdAt = faker.date.past();
  user.updatedAt = faker.date.recent();
  user.hashedRefreshToken = undefined;

  return user;
});