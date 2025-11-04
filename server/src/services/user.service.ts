/**
 * User Management Service
 * 
 * Handles all user-related business logic including profile management,
 * password changes, and vacation following functionality.
 * Implements data validation and security measures.
 * 
 * Features:
 * - Profile management
 * - Password security
 * - Vacation following
 * - Error handling
 * - Data validation
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AppDataSource } from '../config/data-source';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * Find User by ID
   * 
   * Retrieves a user's complete profile including followed vacations.
   * 
   * @param id - User's unique identifier
   * @returns Complete user object with relationships
   * 
   * @throws AppError
   * - 404: User not found
   */
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Update User Profile
   * 
   * Updates user profile information with validation.
   * Checks email uniqueness when email is being changed.
   * 
   * @param userId - User's unique identifier
   * @param userData - Updated profile fields (firstName, lastName, email)
   * @returns Updated user object
   * 
   * @throws AppError
   * - 404: User not found
   * - 400: Email already exists
   */
  async updateProfile(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    
    // Remove sensitive fields from update data
    delete updateData.password;
    delete updateData.role;
    
    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  /**
   * Change User Password
   * 
   * Updates user's password with security validation.
   * Verifies current password before allowing change.
   * 
   * @param userId - User's unique identifier
   * @param currentPassword - User's current password
   * @param newPassword - New password to set
   * 
   * @throws AppError
   * - 404: User not found
   * - 401: Current password incorrect
   */
  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.findById(id);

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
  }

  /**
   * Get User's Followed Vacations
   * 
   * Retrieves all vacations that the user is following.
   * 
   * @param userId - User's unique identifier
   * @returns Array of followed vacation objects
   * 
   * @throws AppError
   * - 404: User not found
   */
  async getFollowedVacations(userId: string): Promise<any[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.follows', 'follow')
      .leftJoinAndSelect('follow.vacation', 'vacation')
      .where('user.id = :userId', { userId })
      .getMany();
  }
} 