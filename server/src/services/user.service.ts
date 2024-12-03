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

  async updateProfile(
    userId: number,
    userData: Pick<User, 'firstName' | 'lastName' | 'email'>
  ): Promise<User> {
    const user = await this.findById(userId);

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

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.findById(userId);

    const isPasswordValid = await compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Current password is incorrect');
    }

    user.password = await hash(newPassword, 10);
    await this.userRepository.save(user);
    logger.info(`Password changed for user: ${user.email}`);
  }

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