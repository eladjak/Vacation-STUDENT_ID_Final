import { AppDataSource } from './data-source';
import { User, UserRole } from '../entities/User';
import { Vacation } from '../entities/Vacation';
import { VacationFollow } from '../entities/VacationFollow';
import { hash } from 'bcryptjs';
import { logger } from '../utils/logger';
import * as fs from 'fs';
import * as path from 'path';

async function seed() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    logger.info('Database connection initialized');

    // Get repositories
    const userRepository = AppDataSource.getRepository(User);
    const vacationRepository = AppDataSource.getRepository(Vacation);
    const followRepository = AppDataSource.getRepository(VacationFollow);

    // Read and execute setup.sql
    logger.info('Setting up database...');
    const setupSql = fs.readFileSync(path.join(__dirname, 'setup.sql'), 'utf8');
    const setupCommands = setupSql.split(';').filter(cmd => cmd.trim());
    
    for (const command of setupCommands) {
      if (command.trim()) {
        try {
          await AppDataSource.query(command);
        } catch (err: any) {
          // Ignore errors about database already existing
          if (err?.message && !err.message.includes('database exists')) {
            throw err;
          }
        }
      }
    }
    logger.info('Database setup completed');

    // Clear existing data - order matters due to foreign key constraints
    logger.info('Clearing existing data...');
    
    // Disable foreign key checks
    await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Clear all tables
    await followRepository.clear();
    await vacationRepository.clear();
    await userRepository.clear();
    
    // Re-enable foreign key checks
    await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 1');
    
    logger.info('Existing data cleared');

    // Create admin user
    const adminPassword = '123456';
    const hashedPassword = await hash(adminPassword, 10);
    
    const admin = userRepository.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@test.com',
      password: hashedPassword,
      role: UserRole.ADMIN
    });
    await userRepository.save(admin);
    logger.info('Admin user created');

    // Create regular user
    const user = userRepository.create({
      firstName: 'Regular',
      lastName: 'User',
      email: 'user@test.com',
      password: hashedPassword,
      role: UserRole.USER
    });
    await userRepository.save(user);
    logger.info('Regular user created');

    // Create sample vacations
    const vacations = [
      {
        destination: 'פריז, צרפת',
        description: 'חוויה קסומה בעיר האורות עם אתרים איקוניים ואווירה רומנטית',
        startDate: '2024-06-15',
        endDate: '2024-06-22',
        price: 1200.00,
        imageUrl: '/uploads/vacations/paris.jpg',
        followersCount: 0
      },
      {
        destination: 'טוקיו, יפן',
        description: 'טיול מרתק בתרבות היפנית, טכנולוגיה ואוכל מדהים',
        startDate: '2024-07-01',
        endDate: '2024-07-10',
        price: 2500.00,
        imageUrl: '/uploads/vacations/tokyo.jpg',
        followersCount: 0
      },
      {
        destination: 'סנטוריני, יוון',
        description: 'חופשה מושלמת עם שקיעות מרהיבות וארכיטקטורה לבנה מדהימה',
        startDate: '2024-08-05',
        endDate: '2024-08-12',
        price: 1800.00,
        imageUrl: '/uploads/vacations/santorini.jpg',
        followersCount: 0
      },
      {
        destination: 'ניו יורק, ארה"ב',
        description: 'חוויה אורבנית בעיר שלא נרדמת לעולם',
        startDate: '2024-09-10',
        endDate: '2024-09-17',
        price: 2200.00,
        imageUrl: '/uploads/vacations/nyc.jpg',
        followersCount: 0
      },
      {
        destination: 'האיים המלדיביים',
        description: 'גן עדן טרופי עם מים צלולים ומלונות יוקרה',
        startDate: '2024-10-01',
        endDate: '2024-10-08',
        price: 3000.00,
        imageUrl: '/uploads/vacations/maldives.jpg',
        followersCount: 0
      }
    ];

    const savedVacations = [];
    for (const vacationData of vacations) {
      const vacation = vacationRepository.create(vacationData);
      const savedVacation = await vacationRepository.save(vacation);
      savedVacations.push(savedVacation);
    }
    logger.info('Sample vacations created');

    // Add some vacation follows for the regular user
    const vacationsToFollow = savedVacations.slice(0, 3); // Follow first 3 vacations

    for (const vacation of vacationsToFollow) {
      const follow = followRepository.create({
        user,
        vacation
      });
      await followRepository.save(follow);
      
      // Update followers count
      vacation.followersCount += 1;
      await vacationRepository.save(vacation);
    }
    logger.info('Vacation follows created');

    logger.info('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Seed failed:', error);
    process.exit(1);
  }
}

seed(); 