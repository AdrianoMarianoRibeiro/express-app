import 'dotenv/config';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'express_app_mysql',
  keepConnectionAlive: true,
  logging: process.env.NODE_ENV !== 'production',
  synchronize: false,
  entities: [`${__dirname}/../**/*.entity.{ts,js}`],
  migrations: [`${__dirname}/migrations/**/*.{ts,js}`],
  subscribers: [`${__dirname}/subscribers/**/*.{ts,js}`],
  timezone: 'Z',
  dateStrings: false,
  poolSize: 10,
  extra: {
    connectionLimit: 10,
    ssl:
      process.env.DATABASE_SSL_ENABLED === 'true'
        ? {
            rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
            ca: process.env.DATABASE_CA ?? undefined,
            key: process.env.DATABASE_KEY ?? undefined,
            cert: process.env.DATABASE_CERT ?? undefined,
          }
        : false,
  },
} as DataSourceOptions);

export default AppDataSource;
