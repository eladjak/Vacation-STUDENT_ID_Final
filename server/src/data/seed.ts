import { AppDataSource } from '../config/data-source';
import { Vacation } from '../entities/vacation.entity';
import { VacationFollow } from '../entities/vacation-follow.entity';
import { User } from '../entities/user.entity';

const seedDatabase = async () => {
  try {
    // Clear existing data
    await AppDataSource.getRepository(VacationFollow).delete({});
    await AppDataSource.getRepository(Vacation).delete({});

    // Create vacations
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

    // Get all users
    const users = await AppDataSource.getRepository(User).find();

    // Create random follows (20-90% of users will follow each vacation)
    for (const vacation of vacations) {
      const followCount = Math.floor(Math.random() * (0.9 - 0.2 + 1) * users.length + 0.2 * users.length);
      const shuffledUsers = users.sort(() => Math.random() - 0.5).slice(0, followCount);
      
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

// Export the seed function
export { seedDatabase }; 