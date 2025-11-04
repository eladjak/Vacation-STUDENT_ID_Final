import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialSchema1703234567890 implements MigrationInterface {
    name = 'CreateInitialSchema1703234567890';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create users table
        await queryRunner.query(`
            CREATE TABLE users (
                id VARCHAR(36) NOT NULL PRIMARY KEY,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
                is_active BOOLEAN NOT NULL DEFAULT true,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Create vacations table
        await queryRunner.query(`
            CREATE TABLE vacations (
                id VARCHAR(36) NOT NULL PRIMARY KEY,
                title VARCHAR(100) NOT NULL,
                description TEXT NOT NULL,
                destination VARCHAR(100) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                image_urls TEXT,
                followers_count INT NOT NULL DEFAULT 0,
                max_participants INT NOT NULL,
                current_participants INT NOT NULL DEFAULT 0,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Create vacation_follows table
        await queryRunner.query(`
            CREATE TABLE vacation_follows (
                id VARCHAR(36) NOT NULL PRIMARY KEY,
                user_id VARCHAR(36) NOT NULL,
                vacation_id VARCHAR(36) NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (vacation_id) REFERENCES vacations(id) ON DELETE CASCADE,
                UNIQUE KEY unique_user_vacation (user_id, vacation_id)
            )
        `);

        // Add indexes
        await queryRunner.query(`
            CREATE INDEX idx_vacation_dates ON vacations(start_date, end_date);
            CREATE INDEX idx_vacation_price ON vacations(price);
            CREATE INDEX idx_user_email ON users(email);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables in reverse order
        await queryRunner.query('DROP TABLE IF EXISTS vacation_follows');
        await queryRunner.query('DROP TABLE IF EXISTS vacations');
        await queryRunner.query('DROP TABLE IF EXISTS users');
    }
} 