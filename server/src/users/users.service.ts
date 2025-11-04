/**
 * Users Service
 * Handles user-related operations and database interactions
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  /**
   * Find user by email
   * @param email - User's email address
   * @returns User entity if found, null otherwise
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  /**
   * Create new user
   * @param userData - User data for creation
   * @returns Created user entity
   */
  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  /**
   * Find user by ID
   * @param id - User's ID
   * @returns User entity if found, null otherwise
   */
  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  /**
   * Update user verification status
   * @param userId - User's ID
   * @param isVerified - New verification status
   * @returns Updated user entity
   */
  async updateVerificationStatus(userId: string, isVerified: boolean): Promise<User> {
    await this.usersRepository.update(userId, { isEmailVerified: isVerified });
    return this.findById(userId);
  }
} 