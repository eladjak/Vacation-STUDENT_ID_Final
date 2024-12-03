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

  private async deleteImageFile(imageUrl: string) {
    try {
      const imagePath = path.join(__dirname, '../../', imageUrl);
      await unlink(imagePath);
      logger.info(`Deleted image file: ${imagePath}`);
    } catch (error) {
      logger.error(`Failed to delete image file: ${imageUrl}`, error);
    }
  }

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

  async createVacation(vacationData: Partial<Vacation>): Promise<Vacation> {
    const vacation = this.vacationRepository.create(vacationData);
    await this.vacationRepository.save(vacation);
    logger.info(`New vacation created: ${vacation.destination}`);
    return vacation;
  }

  async updateVacation(id: number, vacationData: Partial<Vacation>): Promise<Vacation> {
    const vacation = await this.getVacationById(id);
    
    // If there's a new image and an old one exists, delete the old one
    if (vacationData.imageUrl && vacation.imageUrl && vacationData.imageUrl !== vacation.imageUrl) {
      await this.deleteImageFile(vacation.imageUrl);
    }

    Object.assign(vacation, vacationData);
    await this.vacationRepository.save(vacation);
    logger.info(`Vacation updated: ${vacation.destination}`);
    return vacation;
  }

  async deleteVacation(id: number): Promise<void> {
    const vacation = await this.getVacationById(id);
    
    // Delete the image file if it exists
    if (vacation.imageUrl) {
      await this.deleteImageFile(vacation.imageUrl);
    }

    await this.vacationRepository.remove(vacation);
    logger.info(`Vacation deleted: ${vacation.destination}`);
  }

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