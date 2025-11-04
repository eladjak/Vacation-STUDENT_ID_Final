import { PaymentGatewayService } from './payment-gateway.service';
import { BookingsService } from '../bookings/bookings.service';
export interface PaymentData {
    bookingId: string;
    amount: number;
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
}
export interface PaymentResult {
    status: 'COMPLETED' | 'FAILED';
    transactionId?: string;
    error?: string;
}
export interface Booking {
    id: string;
    vacationId: string;
    numberOfParticipants: number;
}
export declare class PaymentsService {
    private paymentGatewayService;
    private bookingsService;
    private vacationRepository;
    constructor(paymentGatewayService: PaymentGatewayService, bookingsService: BookingsService);
    private initializeRepository;
    processPayment(paymentData: PaymentData): Promise<PaymentResult>;
    validatePayment(vacationId: string, paymentData: PaymentData): Promise<boolean>;
}
