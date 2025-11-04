/**
 * Database Configuration and Initialization
 * 
 * Configures and initializes the TypeORM data source for MySQL database connection.
 * Handles database creation, connection setup, and entity management.
 * 
 * Features:
 * - Automatic database creation
 * - Environment-based configuration
 * - UTF-8 character support
 * - Entity relationship management
 * - Development mode logging
 */

import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { User } from '../entities/user.entity';
import { Vacation } from '../entities/vacation.entity';
import { VacationFollow } from '../entities/vacation-follow.entity';

// Load environment variables
config();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vacation_db',
  entities: [join(__dirname, '..', 'entities', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, '..', 'migrations', '*{.ts,.js}')],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  migrationsRun: true,
  migrationsTableName: 'migrations',
  charset: 'utf8mb4'
});

export const initializeDataSource = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Data Source has been initialized!');
    }
    return AppDataSource;
  } catch (error) {
    console.error('Error during Data Source initialization:', error);
    throw error;
  }
};

export const getRepository = async <T>(entity: any) => {
  const dataSource = await initializeDataSource();
  return dataSource.getRepository<T>(entity);
};

export { AppDataSource };
export default AppDataSource; 