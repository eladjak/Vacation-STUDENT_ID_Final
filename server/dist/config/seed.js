"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./data-source");
const user_entity_1 = require("../entities/user.entity");
const vacation_entity_1 = require("../entities/vacation.entity");
const vacation_follow_entity_1 = require("../entities/vacation-follow.entity");
const bcryptjs_1 = require("bcryptjs");
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
    transports: [new winston_1.transports.Console()]
});
async function seed() {
    try {
        if (!data_source_1.AppDataSource.isInitialized) {
            await data_source_1.AppDataSource.initialize();
        }
        logger.info('Database connection initialized');
        logger.info('Recreating database schema...');
        await data_source_1.AppDataSource.synchronize(true);
        logger.info('Database schema recreated');
        const hashedPassword = await bcryptjs_1.default.hash('123456', 10);
        const admin = data_source_1.AppDataSource.getRepository(user_entity_1.User).create({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@test.com',
            password: hashedPassword,
            role: 'admin'
        });
        await data_source_1.AppDataSource.getRepository(user_entity_1.User).save(admin);
        logger.info('Admin user created');
        const user = data_source_1.AppDataSource.getRepository(user_entity_1.User).create({
            firstName: 'Regular',
            lastName: 'User',
            email: 'user@test.com',
            password: hashedPassword,
            role: 'user'
        });
        await data_source_1.AppDataSource.getRepository(user_entity_1.User).save(user);
        logger.info('Regular user created');
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
        const savedVacations = [];
        for (const vacationData of vacations) {
            const vacation = data_source_1.AppDataSource.getRepository(vacation_entity_1.Vacation).create(vacationData);
            const savedVacation = await data_source_1.AppDataSource.getRepository(vacation_entity_1.Vacation).save(vacation);
            savedVacations.push(savedVacation);
        }
        logger.info('Sample vacations created');
        const firstVacation = savedVacations[0];
        const follow = data_source_1.AppDataSource.getRepository(vacation_follow_entity_1.VacationFollow).create({
            user,
            vacation: firstVacation
        });
        await data_source_1.AppDataSource.getRepository(vacation_follow_entity_1.VacationFollow).save(follow);
        logger.info('Sample follow created');
        logger.info('Seed completed successfully');
        process.exit(0);
    }
    catch (error) {
        logger.error('Seed failed:', error);
        process.exit(1);
    }
}
seed();
//# sourceMappingURL=seed.js.map