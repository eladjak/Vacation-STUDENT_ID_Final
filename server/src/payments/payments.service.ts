/**
 * Service handling payment operations
 * Manages payment processing and integration with payment providers
 */
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';
import { BookingsService } from '../bookings/bookings.service';
import { Vacation } from '../entities/vacation.entity';
import { initializeDataSource } from '../config/data-source';
import { Repository } from 'typeorm';

/**
 * Payment processing data interface
 */
export interface PaymentData {
  bookingId: string;
  amount: number;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

/**
 * Payment result interface
 */
export interface PaymentResult {
  status: 'COMPLETED' | 'FAILED';
  transactionId?: string;
  error?: string;
}

/**
 * Booking interface
 */
export interface Booking {
  id: string;
  vacationId: string;
  numberOfParticipants: number;
}

@Injectable()
export class PaymentsService {
  private vacationRepository: Repository<Vacation>;

  constructor(
    private paymentGatewayService: PaymentGatewayService,
    private bookingsService: BookingsService
  ) {
    this.initializeRepository();
  }

  private async initializeRepository() {
    const dataSource = await initializeDataSource();
    this.vacationRepository = dataSource.getRepository(Vacation);
  }

  /**
   * Process payment for a booking
   * @param paymentData - Payment details
   * @returns Payment result
   * @throws BadRequestException if payment validation fails
   */
  async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    const booking = await this.bookingsService.findOne(paymentData.bookingId) as Booking;
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const vacation = await this.vacationRepository.findOne({
      where: { id: booking.vacationId }
    });

    if (!vacation) {
      throw new NotFoundException('Vacation not found');
    }

    // Calculate total amount based on vacation price and number of participants
    const expectedAmount = vacation.price * booking.numberOfParticipants;

    // Validate payment amount
    if (expectedAmount !== paymentData.amount) {
      throw new BadRequestException('Payment amount does not match booking total');
    }

    // Process payment through gateway
    const gatewayResult = await this.paymentGatewayService.processPayment(paymentData);

    if (gatewayResult.success) {
      // Update booking status
      await this.bookingsService.updateStatus(booking.id, 'CONFIRMED');
      
      return {
        status: 'COMPLETED',
        transactionId: gatewayResult.transactionId
      };
    }

    return {
      status: 'FAILED',
      error: gatewayResult.message
    };
  }

  /**
   * Validate payment amount against vacation price
   */
  async validatePayment(vacationId: string, paymentData: PaymentData): Promise<boolean> {
    const vacation = await this.vacationRepository.findOne({
      where: { id: vacationId }
    });

    if (!vacation) {
      throw new NotFoundException('Vacation not found');
    }

    // Calculate expected amount based on vacation price
    const expectedAmount = vacation.price;

    if (expectedAmount !== paymentData.amount) {
      throw new BadRequestException('Payment amount does not match vacation price');
    }

    return true;
  }
} 