/**
 * Vacation Management Service
 * 
 * Handles all vacation-related business logic including CRUD operations,
 * follow functionality, statistics, and file management.
 * Implements data validation and file handling security measures.
 * 
 * Features:
 * - Vacation CRUD operations
 * - Image file management
 * - Follow/unfollow functionality
 * - Statistics generation
 * - CSV export capabilities
 * - Pagination and filtering
 */

import { Repository } from 'typeorm';
import { Vacation } from '../entities/Vacation';
import { VacationFollow } from '../entities/VacationFollow';
import { User } from '../entities/User';
import { AppDataSource } from '../config/data-source';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import { unlink } from 'fs/promises';

export class VacationService {
  private vacationRepository: Repository<Vacation>;
  private followRepository: Repository<VacationFollow>;
  private userRepository: Repository<User>;

  constructor() {
    this.vacationRepository = AppDataSource.getRepository(Vacation);
    this.followRepository = AppDataSource.getRepository(VacationFollow);
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * Delete Vacation Image
   * 
   * Removes the image file associated with a vacation.
   * Handles file system operations safely with error logging.
   * 
   * @param imageUrl - Path to the image file
   * @private
   */
  private async deleteImageFile(imageUrl: string) {
    try {
      const imagePath = path.join(__dirname, '../../', imageUrl);
      await unlink(imagePath);
      logger.info(`Deleted image file: ${imagePath}`);
    } catch (error) {
      logger.error(`Failed to delete image file: ${imageUrl}`, error);
    }
  }

  /**
   * Get All Vacations
   * 
   * Retrieves vacations with pagination and optional filters.
   * Includes follower count and user-specific follow status.
   * 
   * @param userId - Current user's ID
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @param filters - Optional filters:
   *   - followed: Show only vacations followed by user
   *   - active: Show only currently active vacations
   *   - upcoming: Show only future vacations
   * 
   * @returns Object containing:
   *   - vacations: Array of vacation objects
   *   - total: Total count of matching vacations
   */
  async getAllVacations(
    userId: number,
    page = 1,
    limit = 10,
    filters?: {
      followed?: boolean;
      active?: boolean;
      upcoming?: boolean;
    }
  ): Promise<{ vacations: Vacation[]; total: number }> {
    const skip = (page - 1) * limit;
    const queryBuilder = this.vacationRepository
      .createQueryBuilder('vacation')
      .leftJoinAndSelect('vacation.followers', 'followers')
      .loadRelationCountAndMap('vacation.followersCount', 'vacation.followers');

    // Apply filters
    if (filters?.followed) {
      queryBuilder.innerJoin('vacation.followers', 'follower', 'follower.userId = :userId', { userId });
    }

    if (filters?.active) {
      const now = new Date();
      queryBuilder.andWhere('vacation.startDate <= :now AND vacation.endDate >= :now', { now });
    }

    if (filters?.upcoming) {
      const now = new Date();
      queryBuilder.andWhere('vacation.startDate > :now', { now });
    }

    const [vacations, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { vacations, total };
  }

  /**
   * Get Single Vacation
   * 
   * Retrieves detailed information about a specific vacation.
   * Includes follower information.
   * 
   * @param id - Vacation ID
   * @returns Complete vacation object with relationships
   * 
   * @throws AppError
   * - 404: Vacation not found
   */
  async getVacationById(id: number): Promise<Vacation> {
    const vacation = await this.vacationRepository.findOne({
      where: { id },
      relations: ['followers']
    });

    if (!vacation) {
      throw new AppError(404, 'Vacation not found');
    }

    return vacation;
  }

  /**
   * Create New Vacation
   * 
   * Creates a new vacation entry with provided data.
   * 
   * @param vacationData - Vacation creation data
   * @returns Created vacation object
   */
  async createVacation(vacationData: Partial<Vacation>): Promise<Vacation> {
    const vacation = this.vacationRepository.create(vacationData);
    await this.vacationRepository.save(vacation);
    logger.info(`New vacation created: ${vacation.destination}`);
    return vacation;
  }

  /**
   * Update Vacation
   * 
   * Updates an existing vacation's information.
   * Handles image replacement if new image is provided.
   * 
   * @param id - Vacation ID
   * @param vacationData - Updated vacation data
   * @returns Updated vacation object
   * 
   * @throws AppError
   * - 404: Vacation not found
   */
  async updateVacation(id: number, vacationData: Partial<Vacation>): Promise<Vacation> {
    const vacation = await this.getVacationById(id);
    
    // Handle image replacement
    if (vacationData.imageUrl && vacation.imageUrl && vacationData.imageUrl !== vacation.imageUrl) {
      await this.deleteImageFile(vacation.imageUrl);
    }

    Object.assign(vacation, vacationData);
    await this.vacationRepository.save(vacation);
    logger.info(`Vacation updated: ${vacation.destination}`);
    return vacation;
  }

  /**
   * Delete Vacation
   * 
   * Removes a vacation and its associated image file.
   * 
   * @param id - Vacation ID
   * 
   * @throws AppError
   * - 404: Vacation not found
   */
  async deleteVacation(id: number): Promise<void> {
    const vacation = await this.getVacationById(id);
    
    // Clean up image file
    if (vacation.imageUrl) {
      await this.deleteImageFile(vacation.imageUrl);
    }

    await this.vacationRepository.remove(vacation);
    logger.info(`Vacation deleted: ${vacation.destination}`);
  }

  /**
   * Follow Vacation
   * 
   * Creates a follow relationship between user and vacation.
   * 
   * @param vacationId - Vacation ID
   * @param userId - User ID
   * 
   * @throws AppError
   * - 404: Vacation or user not found
   * - 400: Already following
   */
  async followVacation(vacationId: number, userId: number): Promise<void> {
    const vacation = await this.getVacationById(vacationId);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const existingFollow = await this.followRepository.findOne({
      where: { vacation: { id: vacationId }, user: { id: userId } }
    });

    if (existingFollow) {
      throw new AppError(400, 'Already following this vacation');
    }

    const follow = this.followRepository.create({ vacation, user });
    await this.followRepository.save(follow);
    logger.info(`User ${userId} followed vacation ${vacationId}`);
  }

  /**
   * Unfollow Vacation
   * 
   * Removes a follow relationship between user and vacation.
   * 
   * @param vacationId - Vacation ID
   * @param userId - User ID
   * 
   * @throws AppError
   * - 404: Follow relationship not found
   */
  async unfollowVacation(vacationId: number, userId: number): Promise<void> {
    const follow = await this.followRepository.findOne({
      where: { vacation: { id: vacationId }, user: { id: userId } }
    });

    if (!follow) {
      throw new AppError(404, 'Not following this vacation');
    }

    await this.followRepository.remove(follow);
    logger.info(`User ${userId} unfollowed vacation ${vacationId}`);
  }

  /**
   * Get Follower Statistics
   * 
   * Retrieves follower count statistics for all vacations.
   * 
   * @returns Array of objects containing:
   *   - destination: Vacation destination
   *   - followers: Number of followers
   */
  async getFollowersStats(): Promise<{ destination: string; followers: number }[]> {
    const stats = await this.vacationRepository
      .createQueryBuilder('vacation')
      .loadRelationCountAndMap('vacation.followersCount', 'vacation.followers')
      .getMany();

    return stats.map(vacation => ({
      destination: vacation.destination,
      followers: (vacation as any).followersCount
    }));
  }

  /**
   * Export Statistics to CSV
   * 
   * Generates a CSV file containing vacation statistics.
   * 
   * @returns Path to the generated CSV file
   */
  async exportToCsv(): Promise<string> {
    const stats = await this.getFollowersStats();
    const csvFilePath = path.join(__dirname, '../../uploads/vacation-stats.csv');

    const csvWriter = createObjectCsvWriter({
      path: csvFilePath,
      header: [
        { id: 'destination', title: 'Destination' },
        { id: 'followers', title: 'Followers' }
      ]
    });

    await csvWriter.writeRecords(stats);
    logger.info('Vacation stats exported to CSV');
    return csvFilePath;
  }
} 