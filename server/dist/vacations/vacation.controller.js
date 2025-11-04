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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VacationController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const platform_express_1 = require("@nestjs/platform-express");
const vacations_service_1 = require("./vacations.service");
const isAdmin_1 = require("../middleware/isAdmin");
const dto_1 = require("./dto");
let VacationController = class VacationController {
    constructor(vacationsService) {
        this.vacationsService = vacationsService;
    }
    mapToResponseDto(vacation) {
        return {
            id: vacation.id,
            title: vacation.title,
            description: vacation.description,
            destination: vacation.destination,
            price: vacation.price,
            startDate: vacation.startDate,
            endDate: vacation.endDate,
            imageUrls: vacation.imageUrls || [],
            followersCount: vacation.followersCount || 0,
            maxParticipants: vacation.maxParticipants,
            currentParticipants: vacation.currentParticipants || 0,
            isFollowing: false,
            remainingSpots: vacation.calculateRemainingSpots()
        };
    }
    async getAll(req) {
        const vacations = await this.vacationsService.findAll();
        return vacations.map(vacation => this.mapToResponseDto(vacation));
    }
    async getOne(id) {
        const vacation = await this.vacationsService.findOne(id);
        return this.mapToResponseDto(vacation);
    }
    async create(createVacationDto, files) {
        if (files?.length > 0) {
            createVacationDto.imageUrls = files.map(file => file.path);
        }
        const vacation = await this.vacationsService.create(createVacationDto);
        return this.mapToResponseDto(vacation);
    }
    async update(id, updateVacationDto, files) {
        if (files?.length > 0) {
            updateVacationDto.imageUrls = files.map(file => file.path);
        }
        const vacation = await this.vacationsService.update(id, updateVacationDto);
        return this.mapToResponseDto(vacation);
    }
    async remove(id) {
        return this.vacationsService.remove(id);
    }
    async follow(id, req) {
        const userId = req.user?.id;
        return this.vacationsService.follow(userId, id);
    }
    async unfollow(id, req) {
        const userId = req.user?.id;
        return this.vacationsService.unfollow(userId, id);
    }
    async getFollowersStats() {
        return this.vacationsService.getFollowersStats();
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VacationController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VacationController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(isAdmin_1.IsAdminGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateVacationDto,
        Array]),
    __metadata("design:returntype", Promise)
], VacationController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(isAdmin_1.IsAdminGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateVacationDto,
        Array]),
    __metadata("design:returntype", Promise)
], VacationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(isAdmin_1.IsAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VacationController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/follow'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VacationController.prototype, "follow", null);
__decorate([
    (0, common_1.Delete)(':id/follow'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VacationController.prototype, "unfollow", null);
__decorate([
    (0, common_1.Get)('stats/followers'),
    (0, common_1.UseGuards)(isAdmin_1.IsAdminGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VacationController.prototype, "getFollowersStats", null);
VacationController = __decorate([
    (0, common_1.Controller)('vacations'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [vacations_service_1.VacationsService])
], VacationController);
exports.VacationController = VacationController;
//# sourceMappingURL=vacation.controller.js.map