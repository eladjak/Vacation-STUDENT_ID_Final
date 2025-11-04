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
exports.VacationFollow = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const vacation_entity_1 = require("./vacation.entity");
const user_entity_1 = require("./user.entity");
let VacationFollow = class VacationFollow {
    constructor(data) {
        if (data) {
            Object.assign(this, data);
        }
    }
    belongsToUser(userId) {
        return this.userId === userId;
    }
    isForVacation(vacationId) {
        return this.vacation?.id === vacationId;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], VacationFollow.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vacation_entity_1.Vacation, vacation => vacation.follows, {
        onDelete: 'CASCADE',
        nullable: false
    }),
    (0, typeorm_1.JoinColumn)({ name: 'vacation_id' }),
    __metadata("design:type", vacation_entity_1.Vacation)
], VacationFollow.prototype, "vacation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.follows, {
        onDelete: 'CASCADE',
        nullable: false
    }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], VacationFollow.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], VacationFollow.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], VacationFollow.prototype, "createdAt", void 0);
VacationFollow = __decorate([
    (0, typeorm_1.Entity)('vacation_follows'),
    (0, typeorm_1.Unique)(['userId', 'vacation']),
    (0, typeorm_1.Index)(['userId', 'vacation']),
    __metadata("design:paramtypes", [Object])
], VacationFollow);
exports.VacationFollow = VacationFollow;
//# sourceMappingURL=vacation-follow.entity.js.map