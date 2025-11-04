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
exports.Vacation = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const vacation_follow_entity_1 = require("./vacation-follow.entity");
let Vacation = class Vacation {
    get imageUrl() {
        return this.imageUrls && this.imageUrls.length > 0 ? this.imageUrls[0] : null;
    }
    calculateRemainingSpots() {
        return this.maxParticipants - (this.currentParticipants || 0);
    }
    isActive() {
        const now = new Date();
        return this.startDate <= now && this.endDate >= now;
    }
    isUpcoming() {
        const now = new Date();
        return this.startDate > now;
    }
    hasAvailableSpots(spots) {
        return this.calculateRemainingSpots() >= spots;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Vacation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], Vacation.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], Vacation.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], Vacation.prototype, "destination", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 10,
        scale: 2
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], Vacation.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], Vacation.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], Vacation.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array'),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(0),
    (0, class_validator_1.ArrayMaxSize)(10),
    (0, class_validator_1.IsUrl)({}, { each: true }),
    __metadata("design:type", Array)
], Vacation.prototype, "imageUrls", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], Vacation.prototype, "followersCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], Vacation.prototype, "maxParticipants", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], Vacation.prototype, "currentParticipants", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vacation_follow_entity_1.VacationFollow, follow => follow.vacation),
    __metadata("design:type", Array)
], Vacation.prototype, "follows", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Vacation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Vacation.prototype, "updatedAt", void 0);
Vacation = __decorate([
    (0, typeorm_1.Entity)('vacations')
], Vacation);
exports.Vacation = Vacation;
//# sourceMappingURL=vacation.entity.js.map