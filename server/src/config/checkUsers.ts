/**
 * User Database Check Script
 * 
 * Development utility script that checks and displays all users
 * currently in the database. Useful for verifying user creation
 * and debugging authentication issues.
 * 
 * Features:
 * - Database connection management
 * - User repository access
 * - Detailed user information display
 * - Error handling and logging
 */

import { AppDataSource } from './data-source';
import { User } from '../entities/User';
import { logger } from '../utils/logger';

/**
 * User Check Function
 * 
 * Connects to the database and retrieves all user records.
 * Displays detailed information about each user including:
 * - Email address
 * - User role
 * - Password hash
 * - Account creation timestamp
 * 
 * Process:
 * 1. Initialize database connection
 * 2. Query all users
 * 3. Display user information
 * 4. Clean up database connection
 * 
 * Note: This script is for development/debugging only.
 * Be cautious about displaying sensitive information in production.
 */
async function checkUsers() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    const userRepository = AppDataSource.getRepository(User);
    
    console.log('Checking users in database...');
    const users = await userRepository.find();
    
    // Display user information
    if (users.length === 0) {
      console.log('No users found in database');
    } else {
      console.log(`Found ${users.length} users:`);
      users.forEach(user => {
        console.log(`
Email: ${user.email}
Role: ${user.role}
Password Hash: ${user.password}
Created At: ${user.createdAt}
        `);
      });
    }
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    // Clean up database connection
    await AppDataSource.destroy();
  }
}

// Execute user check
checkUsers(); 