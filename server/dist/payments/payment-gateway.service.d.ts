import { PaymentGatewayResponse } from './interfaces/payment-gateway.interface';
import { PaymentData } from './payments.service';
export declare class PaymentGatewayService {
    processPayment(paymentData: PaymentData): Promise<PaymentGatewayResponse>;
    private validateCard;
}
