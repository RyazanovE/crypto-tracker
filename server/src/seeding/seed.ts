import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions, runSeeders } from 'typeorm-extension';
import dbConfig from 'src/config/db.config';

const options: DataSourceOptions  & SeederOptions = {
  ...dbConfig(),
  factories: ['src/seeding/factories/**/*.factory{.ts,.js}'],
  seeds: ['src/seeding/seeds/**/*.seeder{.ts,.js}']
}

const dataSource = new DataSource(options)
dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
})