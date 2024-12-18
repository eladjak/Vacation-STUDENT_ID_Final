/**
 * Integration tests for Bookings module
 * Tests the complete booking flow including:
 * - Booking creation
 * - Vacation spots management
 * - Status updates
 * - Integration with Vacations module
 */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingsService } from '../../src/bookings/bookings.service';
import { VacationsService } from '../../src/vacations/vacations.service';
import { Booking } from '../../src/entities/booking.entity';
import { Vacation } from '../../src/entities/vacation.entity';
import { User } from '../../src/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('BookingsService Integration', () => {
  let bookingsService: BookingsService;
  let vacationsService: VacationsService;
  let bookingRepository: Repository<Booking>;
  let vacationRepository: Repository<Vacation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        VacationsService,
        {
          provide: getRepositoryToken(Booking),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Vacation),
          useClass: Repository,
        },
      ],
    }).compile();

    bookingsService = module.get<BookingsService>(BookingsService);
    vacationsService = module.get<VacationsService>(VacationsService);
    bookingRepository = module.get<Repository<Booking>>(getRepositoryToken(Booking));
    vacationRepository = module.get<Repository<Vacation>>(getRepositoryToken(Vacation));
  });

  /**
   * Test suite for booking creation process
   */
  describe('Booking Creation', () => {
    it('should create a booking and update vacation spots', async () => {
      const mockUser = { id: '1' } as User;
      const mockVacation = {
        id: '1',
        title: 'Test Vacation',
        maxParticipants: 10,
        remainingSpots: 10,
      } as Vacation;

      const mockBooking = {
        id: '1',
        user: mockUser,
        vacation: mockVacation,
        numberOfParticipants: 2,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      } as Booking;

      jest.spyOn(vacationsService, 'findOne').mockResolvedValue(mockVacation);
      jest.spyOn(bookingRepository, 'create').mockReturnValue(mockBooking);
      jest.spyOn(bookingRepository, 'save').mockResolvedValue(mockBooking);
      jest.spyOn(vacationRepository, 'save').mockResolvedValue(mockVacation);

      const result = await bookingsService.create({
        userId: '1',
        vacationId: '1',
        numberOfParticipants: 2
      });

      expect(result).toBeDefined();
      expect(result.status).toBe('PENDING');
      expect(mockVacation.remainingSpots).toBe(8);
    });

    it('should throw error when vacation not found', async () => {
      jest.spyOn(vacationsService, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(bookingsService.create({
        userId: '1',
        vacationId: 'non-existent',
        numberOfParticipants: 2,
      })).rejects.toThrow(NotFoundException);
    });
  });

  /**
   * Test suite for booking status management
   */
  describe('Booking Status Management', () => {
    it('should update booking status', async () => {
      const booking = {
        id: '1',
        status: 'PENDING',
      } as Booking;

      jest.spyOn(bookingRepository, 'findOne').mockResolvedValue(booking);
      jest.spyOn(bookingRepository, 'save').mockResolvedValue({
        ...booking,
        status: 'CONFIRMED',
      } as Booking);

      const result = await bookingsService.updateStatus('1', 'CONFIRMED');
      expect(result.status).toBe('CONFIRMED');
    });
  });
}); 