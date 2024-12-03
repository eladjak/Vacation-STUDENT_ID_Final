-- Start transaction
START TRANSACTION;

-- Clear existing data
DELETE FROM vacation_follows;
DELETE FROM vacations;
DELETE FROM users;

-- Create test users
-- Password for both users is: Test12345

-- Admin user
INSERT INTO users (firstName, lastName, email, password, role, createdAt, updatedAt)
VALUES (
  'Admin',
  'User',
  'admin@test.com',
  '$2a$10$fdnWXHcv8uVV9.hkVc4rKexUgMCt5omqPJUKQC1yLAXdv193WAT.S',
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
  '$2a$10$fdnWXHcv8uVV9.hkVc4rKexUgMCt5omqPJUKQC1yLAXdv193WAT.S',
  'user',
  NOW(),
  NOW()
);

-- Add sample vacations
INSERT INTO vacations (destination, description, startDate, endDate, price, imageUrl, followersCount, createdAt, updatedAt)
VALUES 
('פריז, צרפת', 'חוויה קסומה בעיר האורות עם אתרים איקוניים ואווירה רומנטית', '2024-06-15', '2024-06-22', 1200.00, '/uploads/vacations/paris.jpg', 0, NOW(), NOW()),
('טוקיו, יפן', 'טיול מרתק בתרבות היפנית, טכנולוגיה ואוכל מדהים', '2024-07-01', '2024-07-10', 2500.00, '/uploads/vacations/tokyo.jpg', 0, NOW(), NOW()),
('סנטוריני, יוון', 'חופשה מושלמת עם שקיעות מרהיבות וארכיטקטורה לבנה מדהימה', '2024-08-05', '2024-08-12', 1800.00, '/uploads/vacations/santorini.jpg', 0, NOW(), NOW()),
('ניו יורק, ארה"ב', 'חוויה אורבנית בעיר שלא נרדמת לעולם', '2024-09-10', '2024-09-17', 2200.00, '/uploads/vacations/nyc.jpg', 0, NOW(), NOW()),
('האיים המלדיביים', 'גן עדן טרופי עם מים צלולים ומלונות יוקרה', '2024-10-01', '2024-10-08', 3000.00, '/uploads/vacations/maldives.jpg', 0, NOW(), NOW());

-- Add vacation follows (using SELECT to get the correct IDs)
INSERT INTO vacation_follows (userId, vacationId, createdAt)
SELECT 
    (SELECT id FROM users WHERE email = 'user@test.com'),
    id,
    NOW()
FROM vacations 
WHERE destination IN ('פריז, צרפת', 'סנטוריני, יוון', 'האיים המלדיביים');

-- Update followers count
UPDATE vacations v 
SET followersCount = (
    SELECT COUNT(*) 
    FROM vacation_follows vf 
    WHERE vf.vacationId = v.id
);

-- Commit transaction
COMMIT; 