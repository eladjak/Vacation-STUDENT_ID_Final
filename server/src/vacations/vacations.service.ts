/**
 * Service handling vacation operations
 * Manages vacation CRUD operations and advanced search functionality
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacation } from '../entities/vacation.entity';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { UpdateVacationDto } from './dto/update-vacation.dto';
import { VacationFilters } from './types/vacation-filters.type';

@Injectable()
export class VacationsService {
  constructor(
    @InjectRepository(Vacation)
    private vacationRepository: Repository<Vacation>
  ) {}

  async create(createVacationDto: CreateVacationDto): Promise<Vacation> {
    const vacation = this.vacationRepository.create({
      ...createVacationDto,
      remainingSpots: createVacationDto.maxParticipants,
    });
    
    const savedVacation = await this.vacationRepository.save(vacation);
    return savedVacation;
  }

  async findAll(): Promise<Vacation[]> {
    const vacations = await this.vacationRepository.find();
    return vacations;
  }

  async findOne(id: string): Promise<Vacation> {
    const vacation = await this.vacationRepository.findOne({ where: { id } });
    if (!vacation) {
      throw new NotFoundException('החופשה לא נמצאה');
    }
    return vacation;
  }

  async update(id: string, updateVacationDto: UpdateVacationDto): Promise<Vacation> {
    const vacation = await this.findOne(id);
    const updatedVacation = await this.vacationRepository.save({
      ...vacation,
      ...updateVacationDto,
    });
    return updatedVacation;
  }

  async remove(id: string): Promise<void> {
    const result = await this.vacationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('החופשה לא נמצאה');
    }
  }

  async bookSpot(id: string): Promise<Vacation> {
    const vacation = await this.findOne(id);
    if (vacation.remainingSpots <= 0) {
      throw new Error('No spots available');
    }
    vacation.remainingSpots--;
    return this.vacationRepository.save(vacation);
  }

  async findWithFilters(filters: VacationFilters): Promise<Vacation[]> {
    const query = this.vacationRepository.createQueryBuilder('vacation');

    if (filters.startDate) {
      query.andWhere('vacation.startDate >= :startDate', { startDate: filters.startDate });
    }
    if (filters.endDate) {
      query.andWhere('vacation.endDate <= :endDate', { endDate: filters.endDate });
    }
    if (filters.minPrice) {
      query.andWhere('vacation.price >= :minPrice', { minPrice: filters.minPrice });
    }
    if (filters.maxPrice) {
      query.andWhere('vacation.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    return query.getMany();
  }

  /**
   * Saves vacation entity
   * @param vacation - Vacation entity to save
   * @returns Saved vacation entity
   */
  async save(vacation: Vacation): Promise<Vacation> {
    return await this.vacationRepository.save(vacation);
  }
} 