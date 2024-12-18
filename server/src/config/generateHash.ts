/**
 * Password Hash Generation Script
 * 
 * Generates SQL insert statements with bcrypt-hashed passwords
 * for creating test user accounts. This script is used during
 * development to create consistent test data.
 * 
 * Features:
 * - Secure password hashing with bcrypt
 * - SQL statement generation
 * - Test user account creation
 * - Timestamp handling
 */

import { hash } from 'bcryptjs';

/**
 * Hash Generation Function
 * 
 * Creates SQL insert statements for test users with hashed passwords.
 * Uses bcrypt with 12 rounds of salting for secure password storage.
 * 
 * Test Accounts Created:
 * 1. Admin User:
 *    - Email: admin@test.com
 *    - Password: Test12345
 *    - Role: admin
 * 
 * 2. Regular User:
 *    - Email: user@test.com
 *    - Password: Test12345
 *    - Role: user
 * 
 * Note: This is for development/testing purposes only.
 * Do not use these credentials in production.
 */
async function generateHash() {
  const password = 'Test12345';
  const hashedPassword = await hash(password, 12);
  
  console.log(`
-- Create test users
-- Password for both users is: Test12345

-- Admin user
INSERT INTO users (firstName, lastName, email, password, role, createdAt, updatedAt)
VALUES (
  'Admin',
  'User',
  'admin@test.com',
  '${hashedPassword}',
  'admin',
  NOW(),
  NOW()
);

-- Regular user
INSERT INTO users (firstName, lastName, email, password, role, createdAt, updatedAt)
VALUES (
  'Regular',
  'User',
  'user@test.com',
  '${hashedPassword}',
  'user',
  NOW(),
  NOW()
);
  `);
}

// Execute hash generation
generateHash(); 