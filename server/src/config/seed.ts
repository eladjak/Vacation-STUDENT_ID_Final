/**
 * Database Seeding Script
 * 
 * Initializes the database with sample data for development and testing.
 * Creates default users, sample vacations, and example relationships.
 * 
 * Features:
 * - Database schema recreation
 * - Default user accounts creation
 * - Sample vacation data
 * - Example user-vacation relationships
 * - Detailed logging
 */

import { AppDataSource } from './data-source';
import { User } from '../entities/user.entity';
import { Vacation } from '../entities/vacation.entity';
import { VacationFollow } from '../entities/vacation-follow.entity';
import bcrypt from 'bcryptjs';
import { Logger } from 'winston';
import { createLogger, format, transports } from 'winston';

/**
 * Logger Configuration
 * 
 * Sets up Winston logger for detailed seed operation logging
 * with timestamp and JSON formatting.
 */
const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [new transports.Console()]
});

/**
 * Database Seeding Function
 * 
 * Performs the complete database seeding process:
 * 1. Initializes database connection
 * 2. Recreates database schema
 * 3. Creates default users (admin and regular)
 * 4. Creates sample vacations
 * 5. Sets up example relationships
 * 
 * Default Users Created:
 * - Admin: admin@test.com / 123456
 * - User: user@test.com / 123456
 * 
 * @throws Error if any seeding operation fails
 */
async function seed() {
  try {
    // Initialize database connection if needed
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    logger.info('Database connection initialized');

    // Clean database and recreate schema
    logger.info('Recreating database schema...');
    await AppDataSource.synchronize(true);
    logger.info('Database schema recreated');

    // Create administrator account
    const hashedPassword = await bcrypt.hash('123456', 10);
    const admin = AppDataSource.getRepository(User).create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'admin'
    });
    await AppDataSource.getRepository(User).save(admin);
    logger.info('Admin user created');

    // Create standard user account
    const user = AppDataSource.getRepository(User).create({
      firstName: 'Regular',
      lastName: 'User',
      email: 'user@test.com',
      password: hashedPassword,
      role: 'user'
    });
    await AppDataSource.getRepository(User).save(user);
    logger.info('Regular user created');

    // Define sample vacation packages
    const vacations = [
      {
        destination: 'פריז, צרפת',
        description: 'עיר האורות המרהיבה מציעה אמנות, תרבות, אוכל משובח ואווירה רומנטית',
        startDate: '2024-01-15',
        endDate: '2024-01-22',
        price: 3500,
        imageUrl: '/uploads/vacations/paris.jpg'
      },
      {
        destination: 'טוקיו, יפן',
        description: 'עיר מרתקת המשלבת מסורת עתיקה עם טכנולוגיה מתקדמת',
        startDate: '2024-02-01',
        endDate: '2024-02-10',
        price: 5000,
        imageUrl: '/uploads/vacations/tokyo.jpg'
      },
      {
        destination: 'ברצלונה, ספרד',
        description: 'עיר תוססת עם אדריכלות ייחודית, תופים מדהימים ותרבות עשירה',
        startDate: '2024-03-05',
        endDate: '2024-03-12',
        price: 2800,
        imageUrl: '/uploads/vacations/barcelona.jpg'
      }
    ];

    // Create vacation records
    const savedVacations = [];
    for (const vacationData of vacations) {
      const vacation = AppDataSource.getRepository(Vacation).create(vacationData);
      const savedVacation = await AppDataSource.getRepository(Vacation).save(vacation);
      savedVacations.push(savedVacation);
    }
    logger.info('Sample vacations created');

    // Create example follow relationship
    const firstVacation = savedVacations[0];
    const follow = AppDataSource.getRepository(VacationFollow).create({
      user,
      vacation: firstVacation
    });
    await AppDataSource.getRepository(VacationFollow).save(follow);
    logger.info('Sample follow created');

    logger.info('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Seed failed:', error);
    process.exit(1);
  }
}

// Execute seeding process
seed(); 