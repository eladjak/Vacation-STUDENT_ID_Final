/**
 * Initial Database Schema Migration
 * 
 * Creates the initial database structure for the vacation tracking system.
 * Establishes tables for users, vacations, and vacation follows with appropriate relationships.
 * 
 * Tables Created:
 * 1. users - User account information
 * 2. vacations - Vacation package details
 * 3. vacation_follows - User-vacation follow relationships
 * 
 * Features:
 * - Automatic timestamps
 * - Foreign key constraints
 * - Unique constraints
 * - Appropriate indexes
 * - Cascade delete rules
 */

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1701454800000 implements MigrationInterface {
    name = 'CreateInitialTables1701454800000'

    /**
     * Migration Up Method
     * 
     * Creates the initial database schema:
     * 1. Creates users table with role-based access
     * 2. Creates vacations table with all necessary fields
     * 3. Creates vacation_follows junction table
     * 4. Adds necessary indexes for performance
     * 
     * @param queryRunner - TypeORM query runner instance
     */
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create users table with role-based access control
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

        // Create vacations table with comprehensive vacation details
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

        // Create junction table for user-vacation follows with unique constraint
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

        // Add performance optimization indexes
        await queryRunner.query(`CREATE INDEX IDX_users_email ON users(email)`);
        await queryRunner.query(`CREATE INDEX IDX_vacations_startDate ON vacations(startDate)`);
        await queryRunner.query(`CREATE INDEX IDX_vacations_endDate ON vacations(endDate)`);
    }

    /**
     * Migration Down Method
     * 
     * Removes all created tables in the correct order to maintain referential integrity.
     * Order: vacation_follows -> vacations -> users
     * 
     * @param queryRunner - TypeORM query runner instance
     */
    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables in reverse order to respect foreign key constraints
        await queryRunner.query(`DROP TABLE IF EXISTS vacation_follows`);
        await queryRunner.query(`DROP TABLE IF EXISTS vacations`);
        await queryRunner.query(`DROP TABLE IF EXISTS users`);
    }
} 