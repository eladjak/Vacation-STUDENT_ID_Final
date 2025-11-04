"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentGatewayService = void 0;
const common_1 = require("@nestjs/common");
let PaymentGatewayService = class PaymentGatewayService {
    async processPayment(paymentData) {
        const isValid = this.validateCard(paymentData);
        if (!isValid) {
            return {
                success: false,
                message: 'Invalid card details',
                transactionId: `failed_${Date.now()}`
            };
        }
        return {
            success: true,
            transactionId: `tx_${Date.now()}`
        };
    }
    validateCard(paymentData) {
        const { cardNumber, expiryMonth, expiryYear, cvv } = paymentData;
        const isValidNumber = cardNumber.length === 16 && /^\d+$/.test(cardNumber);
        const isValidExpiry = /^\d{2}$/.test(expiryMonth) && /^\d{4}$/.test(expiryYear);
        const isValidCvv = /^\d{3}$/.test(cvv);
        return isValidNumber && isValidExpiry && isValidCvv;
    }
};
PaymentGatewayService = __decorate([
    (0, common_1.Injectable)()
], PaymentGatewayService);
exports.PaymentGatewayService = PaymentGatewayService;
//# sourceMappingURL=payment-gateway.service.js.map