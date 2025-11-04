"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const payment_gateway_service_1 = require("./payment-gateway.service");
const bookings_service_1 = require("../bookings/bookings.service");
const vacation_entity_1 = require("../entities/vacation.entity");
const data_source_1 = require("../config/data-source");
let PaymentsService = class PaymentsService {
    constructor(paymentGatewayService, bookingsService) {
        this.paymentGatewayService = paymentGatewayService;
        this.bookingsService = bookingsService;
        this.initializeRepository();
    }
    async initializeRepository() {
        const dataSource = await (0, data_source_1.initializeDataSource)();
        this.vacationRepository = dataSource.getRepository(vacation_entity_1.Vacation);
    }
    async processPayment(paymentData) {
        const booking = await this.bookingsService.findOne(paymentData.bookingId);
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        const vacation = await this.vacationRepository.findOne({
            where: { id: booking.vacationId }
        });
        if (!vacation) {
            throw new common_1.NotFoundException('Vacation not found');
        }
        const expectedAmount = vacation.price * booking.numberOfParticipants;
        if (expectedAmount !== paymentData.amount) {
            throw new common_1.BadRequestException('Payment amount does not match booking total');
        }
        const gatewayResult = await this.paymentGatewayService.processPayment(paymentData);
        if (gatewayResult.success) {
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
    async validatePayment(vacationId, paymentData) {
        const vacation = await this.vacationRepository.findOne({
            where: { id: vacationId }
        });
        if (!vacation) {
            throw new common_1.NotFoundException('Vacation not found');
        }
        const expectedAmount = vacation.price;
        if (expectedAmount !== paymentData.amount) {
            throw new common_1.BadRequestException('Payment amount does not match vacation price');
        }
        return true;
    }
};
PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payment_gateway_service_1.PaymentGatewayService,
        bookings_service_1.BookingsService])
], PaymentsService);
exports.PaymentsService = PaymentsService;
//# sourceMappingURL=payments.service.js.map