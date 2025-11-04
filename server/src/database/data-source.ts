import { createConnection, ConnectionOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from the correct path
config({ path: join(__dirname, '../../.env') });

const AppDataSource: ConnectionOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vacation_db',
  entities: [join(__dirname, '..', 'entities', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, '..', 'migrations', '*{.ts,.js}')],
  synchronize: false,
  logging: true,
  migrationsRun: true,
  migrationsTableName: 'migrations',
  cli: {
    migrationsDir: 'src/migrations',
    entitiesDir: 'src/entities'
  },
  extra: {
    charset: 'utf8mb4_unicode_ci'
  }
};

// Initialize the connection
let connection: Promise<any>;

async function initializeConnection() {
  try {
    connection = createConnection(AppDataSource);
    console.log('Data Source has been initialized!');
    return connection;
  } catch (err) {
    console.error('Error during Data Source initialization:', err);
    throw err;
  }
}

export { AppDataSource, initializeConnection };
export default AppDataSource; 