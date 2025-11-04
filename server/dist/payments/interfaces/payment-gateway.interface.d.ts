export interface PaymentGatewayResponse {
    success: boolean;
    transactionId?: string;
    message?: string;
    error?: string;
}
