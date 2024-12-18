/**
 * Integration tests for Payments module
 * Tests the complete payment flow including:
 * - Payment processing
 * - Integration with booking status updates
 * - Payment gateway communication
 * - Error handling and validation
 */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentsService } from '../../src/payments/payments.service';
import { PaymentGatewayService } from '../../src/payments/payment-gateway.service';
import { BookingsService } from '../../src/bookings/bookings.service';
import { Booking } from '../../src/entities/booking.entity';
import { VacationsService } from '../../src/vacations/vacations.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../../src/entities/user.entity';
import { Vacation } from '../../src/entities/vacation.entity';

describe('PaymentsService Integration', () => {
  let paymentsService: PaymentsService;
  let bookingsService: BookingsService;
  let paymentGatewayService: PaymentGatewayService;
  let bookingRepository: Repository<Booking>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        PaymentGatewayService,
        BookingsService,
        VacationsService,
        ConfigService,
        {
          provide: getRepositoryToken(Booking),
          useClass: Repository,
        }
      ],
    }).compile();

    paymentsService = module.get<PaymentsService>(PaymentsService);
    bookingsService = module.get<BookingsService>(BookingsService);
    paymentGatewayService = module.get<PaymentGatewayService>(PaymentGatewayService);
    bookingRepository = module.get<Repository<Booking>>(getRepositoryToken(Booking));
  });

  /**
   * Test suite for successful payment processing
   */
  describe('Payment Processing - Success Flow', () => {
    it('should process payment and update booking status', async () => {
      const mockUser = { id: '1' } as User;
      const mockVacation = { id: '1', price: 750 } as Vacation;
      
      const mockBooking = {
        id: '1',
        user: mockUser,
        vacation: mockVacation,
        status: 'PENDING',
        numberOfParticipants: 2,
        totalAmount: 1500,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Booking;

      const paymentData = {
        bookingId: mockBooking.id,
        amount: mockBooking.totalAmount,
        cardNumber: '4111111111111111',
        expiryMonth: '12',
        expiryYear: '2025',
        cvv: '123'
      };

      jest.spyOn(bookingsService, 'findOne').mockResolvedValue(mockBooking);
      jest.spyOn(paymentGatewayService, 'processPayment').mockResolvedValue({
        success: true,
        transactionId: 'tx_123'
      });
      jest.spyOn(bookingsService, 'updateStatus').mockResolvedValue({
        ...mockBooking,
        status: 'CONFIRMED'
      } as Booking);

      const result = await paymentsService.processPayment(paymentData);

      expect(result.status).toBe('COMPLETED');
      expect(result.transactionId).toBeDefined();
    });
  });

  /**
   * Test suite for payment failures and error handling
   */
  describe('Payment Processing - Error Handling', () => {
    it('should handle payment gateway failure', async () => {
      const mockUser = { id: '1' } as User;
      const mockVacation = { id: '1', price: 750 } as Vacation;
      
      const mockBooking = {
        id: '1',
        user: mockUser,
        vacation: mockVacation,
        status: 'PENDING',
        numberOfParticipants: 2,
        totalAmount: 1500,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Booking;

      jest.spyOn(bookingsService, 'findOne').mockResolvedValue(mockBooking);
      jest.spyOn(paymentGatewayService, 'processPayment').mockResolvedValue({
        success: false,
        transactionId: 'failed_tx',
        message: 'Insufficient funds'
      });

      const paymentData = {
        bookingId: mockBooking.id,
        amount: mockBooking.totalAmount,
        cardNumber: '4111111111111111',
        expiryMonth: '12',
        expiryYear: '2025',
        cvv: '123'
      };

      const result = await paymentsService.processPayment(paymentData);

      expect(result.status).toBe('FAILED');
      expect(result.error).toBe('Insufficient funds');
    });

    it('should validate payment amount matches booking total', async () => {
      const mockUser = { id: '1' } as User;
      const mockVacation = { id: '1', price: 750 } as Vacation;
      
      const mockBooking = {
        id: '1',
        user: mockUser,
        vacation: mockVacation,
        status: 'PENDING',
        numberOfParticipants: 2,
        totalAmount: 1500,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Booking;

      const paymentData = {
        bookingId: mockBooking.id,
        amount: 1000, // Incorrect amount
        cardNumber: '4111111111111111',
        expiryMonth: '12',
        expiryYear: '2025',
        cvv: '123'
      };

      jest.spyOn(bookingsService, 'findOne').mockResolvedValue(mockBooking);

      await expect(paymentsService.processPayment(paymentData))
        .rejects
        .toThrow('Payment amount does not match booking total');
    });
  });
}); 