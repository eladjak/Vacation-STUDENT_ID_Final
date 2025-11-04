"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInitialTables1701454800000 = void 0;
class CreateInitialTables1701454800000 {
    constructor() {
        this.name = 'CreateInitialTables1701454800000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE users (
                id INT NOT NULL AUTO_INCREMENT,
                firstName VARCHAR(255) NOT NULL,
                lastName VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
                createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE vacations (
                id INT NOT NULL AUTO_INCREMENT,
                destination VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                startDate DATE NOT NULL,
                endDate DATE NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                imageUrl VARCHAR(255) NOT NULL,
                followersCount INT NOT NULL DEFAULT 0,
                createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE vacation_follows (
                id INT NOT NULL AUTO_INCREMENT,
                userId INT NOT NULL,
                vacationId INT NOT NULL,
                createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                UNIQUE KEY UK_user_vacation (userId, vacationId),
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (vacationId) REFERENCES vacations(id) ON DELETE CASCADE
            ) ENGINE=InnoDB
        `);
        await queryRunner.query(`CREATE INDEX IDX_users_email ON users(email)`);
        await queryRunner.query(`CREATE INDEX IDX_vacations_startDate ON vacations(startDate)`);
        await queryRunner.query(`CREATE INDEX IDX_vacations_endDate ON vacations(endDate)`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS vacation_follows`);
        await queryRunner.query(`DROP TABLE IF EXISTS vacations`);
        await queryRunner.query(`DROP TABLE IF EXISTS users`);
    }
}
exports.CreateInitialTables1701454800000 = CreateInitialTables1701454800000;
//# sourceMappingURL=1701454800000-CreateInitialTables.js.map