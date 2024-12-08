-- Drop database if exists and create new one
DROP DATABASE IF EXISTS vacation_db;
CREATE DATABASE vacation_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
USE vacation_db;

-- Create users table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create vacations table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create vacation_follows table
CREATE TABLE vacation_follows (
    id INT NOT NULL AUTO_INCREMENT,
    userId INT NOT NULL,
    vacationId INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY UK_user_vacation (userId, vacationId),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vacationId) REFERENCES vacations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add indexes
CREATE INDEX IDX_users_email ON users(email);
CREATE INDEX IDX_vacations_startDate ON vacations(startDate);
CREATE INDEX IDX_vacations_endDate ON vacations(endDate); 