import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { VacationsService } from '../vacations/vacations.service';

/**
 * Valid booking statuses
 */
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

/**
 * Data required for creating a new booking
 */
export interface CreateBookingDto {
  userId: string;
  vacationId: string;
  numberOfParticipants: number;
}

/**
 * Service handling booking operations
 * Manages vacation bookings, including creation, updates, and status management
 */
@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private vacationsService: VacationsService
  ) {}

  /**
   * Creates a new booking
   * @param bookingData - Data for the new booking
   * @returns Created booking entity
   */
  async create(bookingData: CreateBookingDto): Promise<Booking> {
    const vacation = await this.vacationsService.findOne(bookingData.vacationId);
    
    if (vacation.remainingSpots < bookingData.numberOfParticipants) {
      throw new Error('Not enough spots available');
    }

    const booking = this.bookingRepository.create({
      numberOfParticipants: bookingData.numberOfParticipants,
      status: 'PENDING',
      vacation,
      user: { id: bookingData.userId } as any
    });
    
    // Save the booking first
    const savedBooking = await this.bookingRepository.save(booking);
    
    // Then update vacation spots
    vacation.remainingSpots -= bookingData.numberOfParticipants;
    await this.vacationsService.save(vacation);
    
    return savedBooking;
  }

  /**
   * Updates booking status
   * @param id - Booking ID
   * @param status - New status
   * @returns Updated booking
   */
  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    const booking = await this.findOne(id);
    booking.status = status;
    return await this.bookingRepository.save(booking);
  }

  /**
   * Finds a booking by ID
   * @param id - Booking ID
   * @returns Booking entity
   */
  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['vacation', 'user']
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }
} 