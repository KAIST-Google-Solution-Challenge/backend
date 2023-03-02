import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Record } from './entity';

const RemoteDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'test',
  synchronize: true,
  logging: false,
  entities: [Record],
  migrations: [],
  subscribers: [],
});

const LocalDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.LOCAL_DB_USER,
  password: process.env.LOCAL_DB_PASS,
  database: 'test',
  synchronize: true,
  logging: false,
  entities: [Record],
  migrations: [],
  subscribers: [],
});

const AppDataSource = process.env.NODE_ENV === 'local' ? LocalDataSource : RemoteDataSource;
export { AppDataSource };
