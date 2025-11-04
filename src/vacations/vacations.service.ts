/**
 * Vacations Service
 * 
 * Provides core business logic for vacation-related operations including:
 * - Checking vacation availability
 * - Managing vacation spots
 * - Handling vacation data persistence
 * 
 * This service acts as an abstraction layer between the controller
 * and the database operations.
 * 
 * @module Vacations
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacation } from '../entities/vacation.entity';

@Injectable()
export class VacationsService {
  constructor(
    @InjectRepository(Vacation)
    private readonly vacationRepository: Repository<Vacation>
  ) {}

  /**
   * Checks if a vacation has enough available spots
   * 
   * @param vacationId - The ID of the vacation to check
   * @param numberOfSpots - Number of spots needed
   * @returns True if enough spots are available, false otherwise
   * @throws NotFoundException if the vacation doesn't exist
   */
  async checkAvailability(vacationId: string, numberOfSpots: number): Promise<boolean> {
    const vacation = await this.vacationRepository.findOne({
      where: { id: vacationId }
    });

    if (!vacation) {
      throw new NotFoundException('Vacation not found');
    }

    return vacation.calculateRemainingSpots() >= numberOfSpots;
  }

  /**
   * Saves or updates a vacation entity
   * 
   * @param vacation - The vacation entity to save
   * @returns The saved vacation entity
   */
  async save(vacation: Vacation): Promise<Vacation> {
    return this.vacationRepository.save(vacation);
  }
} 