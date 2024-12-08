import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../entities/user.entity';
import { Vacation } from '../entities/vacation.entity';
import { VacationFollow } from '../entities/vacation-follow.entity';
import path from 'path';
import mysql from 'mysql2/promise';

// Load environment variables
config();

// Create database if it doesn't exist
const createDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE || 'vacation_db'} 
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );

    await connection.end();
    console.log('Database created or already exists');
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  }
};

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'vacation_db',
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Vacation, VacationFollow],
  migrations: [],
  subscribers: [],
  charset: 'utf8mb4'
});

// Initialize database and connection
export const initializeDatabase = async () => {
  try {
    await createDatabase();
    await AppDataSource.initialize();
    console.log('Database connection initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}; 