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
    return { user, token };
  }

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
      logger.info(`Input password length: ${password.length}`);
      logger.info(`Stored hash: ${user.password}`);
      
      const isPasswordValid = await compare(password, user.password);
      logger.info(`Password comparison result: ${isPasswordValid}`);
      
      if (!isPasswordValid) {
        logger.error(`Login failed: Invalid password for user - ${email}`);
        throw new AppError(401, 'Invalid credentials');
      }

      logger.info(`User logged in successfully: ${email}`);
      const token = this.generateToken(user);
      return { user, token };
    } catch (error) {
      logger.error(`Login error for user ${email}:`, error);
      throw new AppError(401, 'Invalid credentials');
    }
  }

  private generateToken(user: User): string {
    return sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }

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