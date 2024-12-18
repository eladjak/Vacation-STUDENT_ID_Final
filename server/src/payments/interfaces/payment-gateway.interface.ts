/**
 * Payment Gateway Response Interface
 * Defines the structure of responses from the payment gateway
 */
export interface PaymentGatewayResponse {
  success: boolean;
  transactionId?: string;
  message?: string;
  error?: string;
} 