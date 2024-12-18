/**
 * Service handling payment operations
 * Manages payment processing and integration with payment providers
 */
import { Injectable, BadRequestException } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';
import { BookingsService } from '../bookings/bookings.service';
import { PaymentGatewayResponse } from './interfaces/payment-gateway.interface';

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

@Injectable()
export class PaymentsService {
  constructor(
    private paymentGatewayService: PaymentGatewayService,
    private bookingsService: BookingsService
  ) {}

  /**
   * Process payment for a booking
   * @param paymentData - Payment details
   * @returns Payment result
   * @throws BadRequestException if payment validation fails
   */
  async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    const booking = await this.bookingsService.findOne(paymentData.bookingId);

    // Validate payment amount
    if (booking.totalAmount !== paymentData.amount) {
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
} 