/**
 * Vacations Service
 * 
 * Provides core business logic for vacation-related operations including:
 * - CRUD operations for vacations
 * - Availability management
 * - Follow/unfollow functionality
 * - Image handling
 * - Statistics and reporting
 * - Pagination and filtering
 */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Vacation } from '../entities/vacation.entity';
import { VacationFollow } from '../entities/vacation-follow.entity';
import { User } from '../entities/user.entity';
import { CreateVacationDto, UpdateVacationDto } from '../vacations/dto';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { logger } from '../utils/logger';
import { initializeDataSource } from '../config/data-source';

@Injectable()
export class VacationsService {
  private vacationRepository: Repository<Vacation>;
  private followRepository: Repository<VacationFollow>;
  private userRepository: Repository<User>;

  constructor() {
    this.initializeRepositories();
  }

  private async initializeRepositories() {
    const dataSource = await initializeDataSource();
    this.vacationRepository = dataSource.getRepository(Vacation);
    this.followRepository = dataSource.getRepository(VacationFollow);
    this.userRepository = dataSource.getRepository(User);
  }

  /**
   * Find all vacations with optional filters
   */
  async findAll(
    userId?: string,
    page = 1,
    limit = 10,
    filters?: {
      followed?: boolean;
      active?: boolean;
      upcoming?: boolean;
    }
  ): Promise<{ vacations: Vacation[]; total: number }> {
    const queryBuilder = this.vacationRepository.createQueryBuilder('vacation');
    const skip = (page - 1) * limit;

    if (filters?.followed && userId) {
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
   * Find a specific vacation by ID
   */
  async findOne(id: string): Promise<Vacation> {
    const vacation = await this.vacationRepository.findOne({
      where: { id },
      relations: ['followers']
    });

    if (!vacation) {
      throw new NotFoundException(`Vacation with ID ${id} not found`);
    }

    return vacation;
  }

  /**
   * Create a new vacation
   */
  async create(createVacationDto: CreateVacationDto): Promise<Vacation> {
    const vacation = this.vacationRepository.create({
      ...createVacationDto,
      followersCount: 0,
      currentParticipants: 0
    });

    if (vacation.startDate > vacation.endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    if (vacation.price < 0) {
      throw new BadRequestException('Price must be positive');
    }

    if (vacation.maxParticipants <= 0) {
      throw new BadRequestException('Maximum participants must be positive');
    }

    const savedVacation = await this.vacationRepository.save(vacation);
    logger.info(`New vacation created: ${vacation.destination}`);
    return savedVacation;
  }

  /**
   * Update an existing vacation
   */
  async update(id: string, updateVacationDto: UpdateVacationDto): Promise<Vacation> {
    const vacation = await this.findOne(id);

    if (updateVacationDto.startDate && updateVacationDto.endDate) {
      if (new Date(updateVacationDto.startDate) > new Date(updateVacationDto.endDate)) {
        throw new BadRequestException('Start date must be before end date');
      }
    }

    if (updateVacationDto.price !== undefined && updateVacationDto.price < 0) {
      throw new BadRequestException('Price must be positive');
    }

    if (updateVacationDto.maxParticipants !== undefined && updateVacationDto.maxParticipants <= 0) {
      throw new BadRequestException('Maximum participants must be positive');
    }

    // Handle image replacement
    if (updateVacationDto.imageUrls && vacation.imageUrls) {
      const removedImages = vacation.imageUrls.filter(
        url => !updateVacationDto.imageUrls?.includes(url)
      );
      await Promise.all(removedImages.map(url => this.deleteImageFile(url)));
    }

    Object.assign(vacation, updateVacationDto);
    const savedVacation = await this.vacationRepository.save(vacation);
    logger.info(`Vacation updated: ${vacation.destination}`);
    return savedVacation;
  }

  /**
   * Remove a vacation
   */
  async remove(id: string): Promise<void> {
    const vacation = await this.findOne(id);

    if (vacation.imageUrls?.length) {
      await Promise.all(vacation.imageUrls.map(url => this.deleteImageFile(url)));
    }

    await this.vacationRepository.remove(vacation);
    logger.info(`Vacation deleted: ${vacation.destination}`);
  }

  /**
   * Follow a vacation
   */
  async follow(userId: string, vacationId: string): Promise<{ isFollowing: boolean; followersCount: number }> {
    const [user, vacation] = await Promise.all([
      this.userRepository.findOne({ where: { id: userId } }),
      this.findOne(vacationId)
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingFollow = await this.followRepository.findOne({
      where: { userId, vacation: { id: vacationId } }
    });

    if (existingFollow) {
      throw new BadRequestException('Already following this vacation');
    }

    const follow = this.followRepository.create({
      userId,
      vacation
    });
    await this.followRepository.save(follow);

    vacation.followersCount = (vacation.followersCount || 0) + 1;
    await this.vacationRepository.save(vacation);

    logger.info(`User ${userId} followed vacation ${vacationId}`);
    return {
      isFollowing: true,
      followersCount: vacation.followersCount
    };
  }

  /**
   * Unfollow a vacation
   */
  async unfollow(userId: string, vacationId: string): Promise<{ isFollowing: boolean; followersCount: number }> {
    const vacation = await this.findOne(vacationId);
    const follow = await this.followRepository.findOne({
      where: { userId, vacation: { id: vacationId } }
    });

    if (!follow) {
      throw new BadRequestException('Not following this vacation');
    }

    await this.followRepository.remove(follow);

    vacation.followersCount = Math.max(0, (vacation.followersCount || 0) - 1);
    await this.vacationRepository.save(vacation);

    logger.info(`User ${userId} unfollowed vacation ${vacationId}`);
    return {
      isFollowing: false,
      followersCount: vacation.followersCount
    };
  }

  /**
   * Get vacation followers statistics
   */
  async getFollowersStats(): Promise<{ destination: string; followersCount: string }[]> {
    return this.vacationRepository
      .createQueryBuilder('vacation')
      .select(['vacation.destination', 'COUNT(followers.id) as followersCount'])
      .leftJoin('vacation.followers', 'followers')
      .groupBy('vacation.id')
      .getRawMany();
  }

  /**
   * Delete image file from disk
   */
  private async deleteImageFile(imageUrl: string): Promise<void> {
    try {
      const imagePath = join(__dirname, '../../', imageUrl);
      await unlink(imagePath);
      logger.info(`Deleted image file: ${imagePath}`);
    } catch (error) {
      logger.error(`Failed to delete image file: ${imageUrl}`, error);
    }
  }
} 