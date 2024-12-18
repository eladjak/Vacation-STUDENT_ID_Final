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
const User_1 = require("./User");
const Vacation_1 = require("./Vacation");
let VacationFollow = class VacationFollow {
};
exports.VacationFollow = VacationFollow;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VacationFollow.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'userId' }),
    __metadata("design:type", Number)
], VacationFollow.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vacationId' }),
    __metadata("design:type", Number)
], VacationFollow.prototype, "vacationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, user => user.followedVacations, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", User_1.User)
], VacationFollow.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Vacation_1.Vacation, vacation => vacation.followers, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'vacationId' }),
    __metadata("design:type", Vacation_1.Vacation)
], VacationFollow.prototype, "vacation", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], VacationFollow.prototype, "createdAt", void 0);
exports.VacationFollow = VacationFollow = __decorate([
    (0, typeorm_1.Entity)('vacation_follows'),
    (0, typeorm_1.Unique)(['userId', 'vacationId'])
], VacationFollow);
//# sourceMappingURL=VacationFollow.js.map