/**
 * Authentication Service
 * 
 * Handles all authentication-related business logic including
 * user registration, login, token management, and password handling.
 * Implements security best practices for user authentication.
 * 
 * Features:
 * - Secure password hashing with bcrypt
 * - JWT token generation and management
 * - User data sanitization
 * - Comprehensive error handling
 * - Detailed logging
 */

import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { AppDataSource } from '../config/data-source';
import { AppError } from '../middleware/errorHandler';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { logger } from '../utils/logger';

export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * User Registration
   * 
   * Creates a new user account with hashed password.
   * Generates JWT token for immediate authentication.
   * 
   * @param userData - User registration data
   * @returns Object containing:
   *   - user: Sanitized user object (no password)
   *   - token: JWT authentication token
   * 
   * @throws AppError
   *   - 400: Email already exists
   *   - 500: Database/hashing error
   */
  async register(userData: Partial<User>): Promise<{ user: User; token: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new AppError(400, 'Email already exists');
    }

    const hashedPassword = await hash(userData.password!, 12);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword
    });

    await this.userRepository.save(user);
    logger.info(`New user registered: ${user.email}`);

    const token = this.generateToken(user);
    const userResponse = this.sanitizeUser(user);
    return { user: userResponse, token };
  }

  /**
   * User Login
   * 
   * Authenticates user with email and password.
   * Generates new JWT token upon successful authentication.
   * 
   * @param email - User's email address
   * @param password - User's password (plain text)
   * @returns Object containing:
   *   - user: Sanitized user object (no password)
   *   - token: JWT authentication token
   * 
   * @throws AppError
   *   - 401: Invalid credentials
   *   - 500: Server error
   */
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (!user) {
      logger.error(`Login failed: User not found - ${email}`);
      throw new AppError(401, 'Invalid credentials');
    }

    try {
      logger.info(`Attempting password comparison for user ${email}`);
      const isPasswordValid = await compare(password, user.password);
      logger.info(`Password comparison result: ${isPasswordValid}`);
      
      if (!isPasswordValid) {
        logger.error(`Login failed: Invalid password for user - ${email}`);
        throw new AppError(401, 'Invalid credentials');
      }

      logger.info(`User logged in successfully: ${email}`);
      const token = this.generateToken(user);
      const userResponse = this.sanitizeUser(user);
      return { user: userResponse, token };
    } catch (error) {
      logger.error(`Login error for user ${email}:`, error);
      throw new AppError(401, 'Invalid credentials');
    }
  }

  /**
   * JWT Token Generation
   * 
   * Creates a new JWT token containing user information.
   * Uses environment variables for configuration.
   * 
   * @param user - User object to encode in token
   * @returns JWT token string
   * 
   * @throws AppError
   *   - 500: JWT secret not configured
   */
  private generateToken(user: User): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      logger.error('JWT_SECRET is not defined');
      throw new AppError(500, 'Server configuration error');
    }

    return sign(
      { userId: user.id, role: user.role },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }

  /**
   * User Data Sanitization
   * 
   * Removes sensitive information (password) from user object.
   * 
   * @param user - Complete user object
   * @returns User object without password
   */
  private sanitizeUser(user: User): User {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  /**
   * Token Refresh
   * 
   * Generates a new JWT token for an existing user.
   * Used to extend user session without re-authentication.
   * 
   * @param userId - ID of user requesting token refresh
   * @returns New JWT token
   * 
   * @throws AppError
   *   - 401: User not found
   */
  async refreshToken(userId: number): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError(401, 'User not found');
    }

    return this.generateToken(user);
  }
} 