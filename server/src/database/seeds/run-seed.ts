/**
 * Database Seed Script
 * 
 * This script populates the database with initial data required for the application
 * to function properly. It includes:
 * - Admin user
 * - Sample vacations
 */
import { createConnection } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { Vacation } from '../../entities/vacation.entity';

async function seed() {
  const connection = await createConnection();

  try {
    // Create admin user
    const userRepository = connection.getRepository(User);
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    const admin = userRepository.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      isActive: true
    });

    await userRepository.save(admin);
    console.log('✅ Admin user created');

    // Create sample vacations
    const vacationRepository = connection.getRepository(Vacation);
    const sampleVacations = [
      {
        title: 'חופשה בפריז',
        description: 'חופשה רומנטית בעיר האורות, כולל סיור במגדל אייפל וארוחת ערב מפנקת',
        destination: 'פריז, צרפת',
        price: 3500,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-03-07'),
        maxParticipants: 20,
        imageUrls: ['paris1.jpg', 'paris2.jpg'],
        currentParticipants: 0,
        followersCount: 0
      },
      {
        title: 'טיול ג\'יפים בדרום',
        description: 'טיול ג\'יפים מאתגר בנגב, כולל לינת שטח ומדורה תחת כוכבים',
        destination: 'הנגב, ישראל',
        price: 1200,
        startDate: new Date('2024-02-15'),
        endDate: new Date('2024-02-17'),
        maxParticipants: 15,
        imageUrls: ['negev1.jpg', 'negev2.jpg'],
        currentParticipants: 0,
        followersCount: 0
      }
    ];

    for (const vacationData of sampleVacations) {
      const vacation = vacationRepository.create(vacationData);
      await vacationRepository.save(vacation);
    }
    console.log('✅ Sample vacations created');

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await connection.close();
  }
}

seed()
  .then(() => {
    console.log('✅ Database seeding completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }); 