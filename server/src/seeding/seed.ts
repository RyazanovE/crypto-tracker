import { pgConfig } from 'src/../dbConfig';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions, runSeeders } from 'typeorm-extension';

const options: DataSourceOptions  & SeederOptions = {
  ...pgConfig,
  factories: ['src/seeding/factories/**/*.factory{.ts,.js}'],
  seeds: ['src/seeding/seeds/**/*.seeder{.ts,.js}']
}

const dataSource = new DataSource(options)
dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
})