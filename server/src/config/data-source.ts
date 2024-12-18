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
import { User } from '../entities/user.entity';
import { Vacation } from '../entities/vacation.entity';
import { VacationFollow } from '../entities/vacation-follow.entity';
import path from 'path';
import mysql from 'mysql2/promise';

// Load environment variables from .env file
config();

/**
 * Database Creation Function
 * 
 * Creates the MySQL database if it doesn't exist.
 * Uses environment variables for configuration with fallback values.
 * 
 * Database Features:
 * - UTF-8 character set (utf8mb4)
 * - Unicode collation
 * - Automatic creation if missing
 * 
 * @throws Error if database creation fails
 */
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

/**
 * TypeORM Data Source Configuration
 * 
 * Main database connection configuration using TypeORM.
 * Configures all aspects of the database connection and ORM behavior.
 * 
 * Configuration Features:
 * - Environment variable based configuration
 * - Development mode SQL logging
 * - Entity registration
 * - Migration support
 * - UTF-8 character encoding
 */
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'vacation_db',
  synchronize: true,                                    // Auto-create database schema (development only)
  logging: process.env.NODE_ENV === 'development',      // SQL logging in development mode
  entities: [User, Vacation, VacationFollow],           // Entity classes
  migrations: [],                                       // Database migrations
  subscribers: [],                                      // Entity subscribers
  charset: 'utf8mb4'                                   // Full UTF-8 support
});

/**
 * Database Initialization Function
 * 
 * Handles the complete database initialization process:
 * 1. Creates database if it doesn't exist
 * 2. Initializes TypeORM connection
 * 
 * @throws Error if initialization fails
 */
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