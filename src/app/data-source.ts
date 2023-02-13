import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Record } from './entity';

export const AppDataSource = new DataSource({
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
