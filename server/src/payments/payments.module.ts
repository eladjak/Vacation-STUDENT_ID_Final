/**
 * Payments module
 * Handles payment processing and integration with payment providers
 */
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentGatewayService } from './payment-gateway.service';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [BookingsModule],
  providers: [PaymentsService, PaymentGatewayService],
  exports: [PaymentsService]
})
export class PaymentsModule {} 