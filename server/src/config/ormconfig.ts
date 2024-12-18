/**
 * TypeORM Configuration
 * 
 * Defines the configuration options for TypeORM database connection.
 * Uses environment variables with fallback values for flexible deployment.
 * 
 * Features:
 * - Environment-based configuration
 * - Development mode features (logging, auto-sync)
 * - Entity/Migration/Subscriber path definitions
 * - MySQL database support
 */

import { DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

/**
 * TypeORM Configuration Object
 * 
 * Complete database connection and ORM configuration:
 * - Database connection parameters
 * - Development features
 * - Entity management
 * - Migration settings
 * 
 * Environment Variables Used:
 * - DB_HOST: Database host (default: localhost)
 * - DB_PORT: Database port (default: 3306)
 * - DB_USERNAME: Database user (default: root)
 * - DB_PASSWORD: Database password
 * - DB_DATABASE: Database name (default: haderech)
 * - NODE_ENV: Environment mode
 */
export const ormconfig: DataSourceOptions = {
  type: 'mysql',                                          // Database type
  host: process.env.DB_HOST || 'localhost',               // Database host
  port: Number(process.env.DB_PORT) || 3306,             // Database port
  username: process.env.DB_USERNAME || 'root',           // Database username
  password: process.env.DB_PASSWORD || '',               // Database password
  database: process.env.DB_DATABASE || 'haderech',       // Database name
  synchronize: process.env.NODE_ENV === 'development',   // Auto-sync schema in development
  logging: process.env.NODE_ENV === 'development',       // SQL logging in development
  entities: ['src/entities/**/*.ts'],                    // Entity class paths
  migrations: ['src/migrations/**/*.ts'],                // Migration file paths
  subscribers: ['src/subscribers/**/*.ts']               // Subscriber file paths
}; 