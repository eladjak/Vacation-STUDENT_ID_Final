import { hash } from 'bcryptjs';

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

generateHash(); 