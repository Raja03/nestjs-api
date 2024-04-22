import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { getConfig } from '../../services/app-config/configuration';

dotenv.config();

const { host, port, password, user, dbName } = getConfig().databases[0];

export default new DataSource({
  type: 'postgres',
  host,
  port,
  username: user,
  password,
  database: dbName,
  entities: ['src/user/entities/master/*.entity.ts'],
  migrations: [`src/**/${dbName}/migrations/*.ts`],
  subscribers: ['src/**/subscribers/*.ts'],
});
