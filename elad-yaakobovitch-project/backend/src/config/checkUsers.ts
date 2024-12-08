import { AppDataSource } from './data-source';
import { User } from '../entities/User';
import { logger } from '../utils/logger';

async function checkUsers() {
  try {
    await AppDataSource.initialize();
    const userRepository = AppDataSource.getRepository(User);
    
    console.log('Checking users in database...');
    const users = await userRepository.find();
    
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
    await AppDataSource.destroy();
  }
}

checkUsers(); 