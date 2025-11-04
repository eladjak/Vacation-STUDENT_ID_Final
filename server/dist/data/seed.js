"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const data_source_1 = require("../config/data-source");
const vacation_entity_1 = require("../entities/vacation.entity");
const vacation_follow_entity_1 = require("../entities/vacation-follow.entity");
const user_entity_1 = require("../entities/user.entity");
const bcryptjs_1 = require("bcryptjs");
const seedDatabase = async () => {
    try {
        await data_source_1.AppDataSource.getRepository(vacation_follow_entity_1.VacationFollow).delete({});
        await data_source_1.AppDataSource.getRepository(vacation_entity_1.Vacation).delete({});
        await data_source_1.AppDataSource.getRepository(user_entity_1.User).delete({});
        const hashedPassword = await bcryptjs_1.default.hash('123456', 10);
        const admin = await data_source_1.AppDataSource.getRepository(user_entity_1.User).save({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@test.com',
            password: hashedPassword,
            role: 'admin'
        });
        console.log('Admin user created');
        const user = await data_source_1.AppDataSource.getRepository(user_entity_1.User).save({
            firstName: 'Regular',
            lastName: 'User',
            email: 'user@test.com',
            password: hashedPassword,
            role: 'user'
        });
        console.log('Regular user created');
        const vacations = await Promise.all([
            data_source_1.AppDataSource.getRepository(vacation_entity_1.Vacation).save({
                destination: 'פריז, צרפת',
                description: 'עיר האורות והרומנטיקה. טיול מושלם הכולל ביקור במגדל אייפל, מוזיאון הלובר, ושיט על נהר הסן.',
                startDate: '2024-06-15',
                endDate: '2024-06-22',
                price: 3500,
                imageUrl: '/uploads/vacations/paris.jpg'
            }),
            data_source_1.AppDataSource.getRepository(vacation_entity_1.Vacation).save({
                destination: 'טוקיו, יפן',
                description: 'חוויה יפנית אותנטית. שילוב מושלם של מסורת ומודרניות, כולל ביקור במקדשים עתיקים ובשכונות הייטק.',
                startDate: '2024-07-01',
                endDate: '2024-07-10',
                price: 5500,
                imageUrl: '/uploads/vacations/tokyo.jpg'
            }),
            data_source_1.AppDataSource.getRepository(vacation_entity_1.Vacation).save({
                destination: 'ברצלונה, ספרד',
                description: 'עיר תוססת עם אדריכלות מרהיבה של גאודי, אוכל מעולה וחופים מדהימים.',
                startDate: '2024-08-10',
                endDate: '2024-08-17',
                price: 3200,
                imageUrl: '/uploads/vacations/barcelona.jpg'
            }),
            data_source_1.AppDataSource.getRepository(vacation_entity_1.Vacation).save({
                destination: 'ניו יורק, ארה"ב',
                description: 'העיר שלא ישנה לעולם. כולל סיור בסנטרל פארק, טיימס סקוור, ומוזיאונים מובילים.',
                startDate: '2024-09-05',
                endDate: '2024-09-12',
                price: 4800,
                imageUrl: '/uploads/vacations/nyc.jpg'
            }),
            data_source_1.AppDataSource.getRepository(vacation_entity_1.Vacation).save({
                destination: 'מלדיביים',
                description: 'גן עדן טרופי עם חופים לבנים, מים צלולים ובקתות מעל המים.',
                startDate: '2024-10-15',
                endDate: '2024-10-25',
                price: 7800,
                imageUrl: '/uploads/vacations/maldives.jpg'
            }),
            data_source_1.AppDataSource.getRepository(vacation_entity_1.Vacation).save({
                destination: 'רומא, איטליה',
                description: 'העיר הנצחית. טיול הכולל ביקור בקולוסיאום, ותיקן, ומזרקת טרווי.',
                startDate: '2024-11-01',
                endDate: '2024-11-08',
                price: 3800,
                imageUrl: '/uploads/vacations/rome.jpg'
            }),
            data_source_1.AppDataSource.getRepository(vacation_entity_1.Vacation).save({
                destination: 'אמסטרדם, הולנד',
                description: 'עיר התעלות היפה. סיור באופניים, ביקור במוזיאון ואן גוך ושיט בתעלות.',
                startDate: '2024-12-05',
                endDate: '2024-12-12',
                price: 3300,
                imageUrl: '/uploads/vacations/amsterdam.jpg'
            }),
            data_source_1.AppDataSource.getRepository(vacation_entity_1.Vacation).save({
                destination: 'דובאי, איחוד האמירויות',
                description: 'חוויית יוקרה במדבר. ביקור בבורג׳ חליפה, ספארי במדבר וקניות בקניונים מפוארים.',
                startDate: '2025-01-10',
                endDate: '2025-01-17',
                price: 4200,
                imageUrl: '/uploads/vacations/dubai.jpg'
            }),
            data_source_1.AppDataSource.getRepository(vacation_entity_1.Vacation).save({
                destination: 'לונדון, אנגליה',
                description: 'עיר קוסמופוליטית עם היסטוריה עשירה. ביקור בארמון בקינגהאם, ביג בן ולונדון איי.',
                startDate: '2025-02-01',
                endDate: '2025-02-10',
                price: 4800,
                imageUrl: '/uploads/vacations/london.jpg'
            }),
            data_source_1.AppDataSource.getRepository(vacation_entity_1.Vacation).save({
                destination: 'סנטוריני, יוון',
                description: 'אי קסום עם נופים מרהיבים, שקיעות מדהימות ואדריכלות ייחודית.',
                startDate: '2025-03-01',
                endDate: '2025-03-08',
                price: 3900,
                imageUrl: '/uploads/vacations/maldives.jpg'
            })
        ]);
        const users = await data_source_1.AppDataSource.getRepository(user_entity_1.User).find();
        for (const vacation of vacations) {
            const followCount = Math.floor(Math.random() * (0.9 - 0.2 + 1) * users.length + 0.2 * users.length);
            const shuffledUsers = users.sort(() => Math.random() - 0.5).slice(0, followCount);
            await Promise.all(shuffledUsers.map(user => data_source_1.AppDataSource.getRepository(vacation_follow_entity_1.VacationFollow).save({
                user,
                vacation
            })));
        }
        console.log('Database seeded successfully');
    }
    catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
};
exports.seedDatabase = seedDatabase;
//# sourceMappingURL=seed.js.map