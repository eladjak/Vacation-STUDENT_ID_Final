import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../entities/User';
import { Vacation } from '../entities/Vacation';
import { VacationFollow } from '../entities/VacationFollow';
import path from 'path';

// Load environment variables
config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'vacation_db',
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Vacation, VacationFollow],
  migrations: [path.join(__dirname, '../migrations/*.ts')],
  subscribers: [path.join(__dirname, '../subscribers/*.ts')],
  charset: 'utf8mb4'
}); 