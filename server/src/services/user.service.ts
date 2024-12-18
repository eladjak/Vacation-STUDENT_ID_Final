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

import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { AppDataSource } from '../config/data-source';
import { AppError } from '../middleware/errorHandler';
import { compare, hash } from 'bcryptjs';
import { logger } from '../utils/logger';

export class UserService {
  private userRepository: Repository<User>;

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
  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['followedVacations']
    });

    if (!user) {
      throw new AppError(404, 'User not found');
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
  async updateProfile(
    userId: number,
    userData: Pick<User, 'firstName' | 'lastName' | 'email'>
  ): Promise<User> {
    const user = await this.findById(userId);

    // Check email uniqueness if being changed
    if (userData.email && userData.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email }
      });

      if (existingUser) {
        throw new AppError(400, 'Email already exists');
      }
    }

    Object.assign(user, userData);
    await this.userRepository.save(user);
    logger.info(`User profile updated: ${user.email}`);
    return user;
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
  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.findById(userId);

    // Verify current password
    const isPasswordValid = await compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Current password is incorrect');
    }

    // Hash and save new password
    user.password = await hash(newPassword, 10);
    await this.userRepository.save(user);
    logger.info(`Password changed for user: ${user.email}`);
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
  async getFollowedVacations(userId: number): Promise<User['followedVacations']> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['followedVacations']
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return user.followedVacations;
  }
} 