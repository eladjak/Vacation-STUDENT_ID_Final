import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacation } from '../entities/vacation.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Vacation)
    private readonly vacationRepository: Repository<Vacation>
  ) {}

  async findOne(id: string) {
    const vacation = await this.vacationRepository.findOne({ where: { id } });
    if (!vacation) {
      throw new NotFoundException(`Vacation with ID ${id} not found`);
    }
    return vacation;
  }

  async updateStatus(id: string, status: string) {
    const vacation = await this.findOne(id);
    // Add your status update logic here
    return this.vacationRepository.save(vacation);
  }

  async createBooking(bookingData: { vacationId: string; numberOfParticipants: number }) {
    const vacation = await this.findOne(bookingData.vacationId);

    if (vacation.calculateRemainingSpots() < bookingData.numberOfParticipants) {
      throw new BadRequestException('Not enough spots available');
    }

    vacation.currentParticipants += bookingData.numberOfParticipants;
    await this.vacationRepository.save(vacation);

    return {
      success: true,
      message: 'Booking created successfully',
      remainingSpots: vacation.calculateRemainingSpots()
    };
  }
} 