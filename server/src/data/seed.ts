/**
 * Database Seeding Module
 * 
 * Provides functionality to populate the database with initial test data.
 * Creates admin and regular users, vacation packages, and simulated follow relationships.
 * 
 * Features:
 * - Database cleanup before seeding
 * - Admin user creation
 * - Regular user creation
 * - Vacation packages creation
 * - Random follow relationships generation
 * - Error handling and logging
 */

import { AppDataSource } from '../config/data-source';
import { Vacation } from '../entities/vacation.entity';
import { VacationFollow } from '../entities/vacation-follow.entity';
import { User } from '../entities/user.entity';
import bcrypt from 'bcryptjs';

/**
 * Database Seeding Function
 * 
 * Main function to populate the database with initial data.
 * Process:
 * 1. Clears existing data
 * 2. Creates admin and regular users
 * 3. Creates vacation packages
 * 4. Generates random follow relationships
 * 
 * @throws Error if seeding process fails
 */
const seedDatabase = async () => {
  try {
    // Clear existing data from all tables
    await AppDataSource.getRepository(VacationFollow).delete({});
    await AppDataSource.getRepository(Vacation).delete({});
    await AppDataSource.getRepository(User).delete({});

    // Create admin user with default credentials
    const hashedPassword = await bcrypt.hash('123456', 10);
    const admin = await AppDataSource.getRepository(User).save({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Admin user created');

    // Create regular test user
    const user = await AppDataSource.getRepository(User).save({
      firstName: 'Regular',
      lastName: 'User',
      email: 'user@test.com',
      password: hashedPassword,
      role: 'user'
    });
    console.log('Regular user created');

    // Create sample vacation packages
    const vacations = await Promise.all([
      AppDataSource.getRepository(Vacation).save({
        destination: 'פריז, צרפת',
        description: 'עיר האורות והרומנטיקה. טיול מושלם הכולל ביקור במגדל אייפל, מוזיאון הלובר, ושיט על נהר הסן.',
        startDate: '2024-06-15',
        endDate: '2024-06-22',
        price: 3500,
        imageUrl: '/uploads/vacations/paris.jpg'
      }),
      AppDataSource.getRepository(Vacation).save({
        destination: 'טוקיו, יפן',
        description: 'חוויה יפנית אותנטית. שילוב מושלם של מסורת ומודרניות, כולל ביקור במקדשים עתיקים ובשכונות הייטק.',
        startDate: '2024-07-01',
        endDate: '2024-07-10',
        price: 5500,
        imageUrl: '/uploads/vacations/tokyo.jpg'
      }),
      AppDataSource.getRepository(Vacation).save({
        destination: 'ברצלונה, ספרד',
        description: 'עיר תוססת עם אדריכלות מרהיבה של גאודי, אוכל מעולה וחופים מדהימים.',
        startDate: '2024-08-10',
        endDate: '2024-08-17',
        price: 3200,
        imageUrl: '/uploads/vacations/barcelona.jpg'
      }),
      AppDataSource.getRepository(Vacation).save({
        destination: 'ניו יורק, ארה"ב',
        description: 'העיר שלא ישנה לעולם. כולל סיור בסנטרל פארק, טיימס סקוור, ומוזיאונים מובילים.',
        startDate: '2024-09-05',
        endDate: '2024-09-12',
        price: 4800,
        imageUrl: '/uploads/vacations/nyc.jpg'
      }),
      AppDataSource.getRepository(Vacation).save({
        destination: 'מלדיביים',
        description: 'גן עדן טרופי עם חופים לבנים, מים צלולים ובקתות מעל המים.',
        startDate: '2024-10-15',
        endDate: '2024-10-25',
        price: 7800,
        imageUrl: '/uploads/vacations/maldives.jpg'
      }),
      AppDataSource.getRepository(Vacation).save({
        destination: 'רומא, איטליה',
        description: 'העיר הנצחית. טיול הכולל ביקור בקולוסיאום, ותיקן, ומזרקת טרווי.',
        startDate: '2024-11-01',
        endDate: '2024-11-08',
        price: 3800,
        imageUrl: '/uploads/vacations/rome.jpg'
      }),
      AppDataSource.getRepository(Vacation).save({
        destination: 'אמסטרדם, הולנד',
        description: 'עיר התעלות היפה. סיור באופניים, ביקור במוזיאון ואן גוך ושיט בתעלות.',
        startDate: '2024-12-05',
        endDate: '2024-12-12',
        price: 3300,
        imageUrl: '/uploads/vacations/amsterdam.jpg'
      }),
      AppDataSource.getRepository(Vacation).save({
        destination: 'דובאי, איחוד האמירויות',
        description: 'חוויית יוקרה במדבר. ביקור בבורג׳ חליפה, ספארי במדבר וקניות בקניונים מפוארים.',
        startDate: '2025-01-10',
        endDate: '2025-01-17',
        price: 4200,
        imageUrl: '/uploads/vacations/dubai.jpg'
      }),
      AppDataSource.getRepository(Vacation).save({
        destination: 'לונדון, אנגליה',
        description: 'עיר קוסמופוליטית עם היסטוריה עשירה. ביקור בארמון בקינגהאם, ביג בן ולונדון איי.',
        startDate: '2025-02-01',
        endDate: '2025-02-10',
        price: 4800,
        imageUrl: '/uploads/vacations/london.jpg'
      }),
      AppDataSource.getRepository(Vacation).save({
        destination: 'סנטוריני, יוון',
        description: 'אי קסום עם נופים מרהיבים, שקיעות מדהימות ואדריכלות ייחודית.',
        startDate: '2025-03-01',
        endDate: '2025-03-08',
        price: 3900,
        imageUrl: '/uploads/vacations/maldives.jpg'
      })
    ]);

    // Get all users for follow relationship generation
    const users = await AppDataSource.getRepository(User).find();

    /**
     * Generate Random Follow Relationships
     * 
     * Creates random follow relationships between users and vacations.
     * Each vacation will be followed by 20-90% of users.
     */
    for (const vacation of vacations) {
      // Calculate random number of followers (20-90% of users)
      const followCount = Math.floor(Math.random() * (0.9 - 0.2 + 1) * users.length + 0.2 * users.length);
      // Randomly shuffle users and select subset
      const shuffledUsers = users.sort(() => Math.random() - 0.5).slice(0, followCount);
      
      // Create follow relationships
      await Promise.all(
        shuffledUsers.map(user =>
          AppDataSource.getRepository(VacationFollow).save({
            user,
            vacation
          })
        )
      );
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

// Export the seed function for use in application setup
export { seedDatabase }; 