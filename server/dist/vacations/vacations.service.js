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
exports.VacationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vacation_entity_1 = require("../entities/vacation.entity");
const vacation_follow_entity_1 = require("../entities/vacation-follow.entity");
let VacationsService = class VacationsService {
    constructor(vacationRepository, followRepository) {
        this.vacationRepository = vacationRepository;
        this.followRepository = followRepository;
    }
    async findAll() {
        return this.vacationRepository.find();
    }
    async findOne(id) {
        const vacation = await this.vacationRepository.findOne({ where: { id } });
        if (!vacation) {
            throw new common_1.NotFoundException(`Vacation with ID ${id} not found`);
        }
        return vacation;
    }
    async create(createVacationDto) {
        const vacation = this.vacationRepository.create(createVacationDto);
        return this.vacationRepository.save(vacation);
    }
    async update(id, updateVacationDto) {
        const vacation = await this.findOne(id);
        Object.assign(vacation, updateVacationDto);
        return this.vacationRepository.save(vacation);
    }
    async remove(id) {
        const vacation = await this.findOne(id);
        await this.vacationRepository.remove(vacation);
    }
    async follow(userId, vacationId) {
        const vacation = await this.findOne(vacationId);
        const existingFollow = await this.followRepository.findOne({
            where: { userId, vacation: { id: vacationId } }
        });
        if (existingFollow) {
            throw new common_1.BadRequestException('Already following this vacation');
        }
        const follow = this.followRepository.create({
            userId,
            vacation
        });
        await this.followRepository.save(follow);
        vacation.followersCount += 1;
        await this.vacationRepository.save(vacation);
        return {
            isFollowing: true,
            followersCount: vacation.followersCount
        };
    }
    async unfollow(userId, vacationId) {
        const vacation = await this.findOne(vacationId);
        await this.followRepository.delete({
            userId,
            vacation: { id: vacationId }
        });
        vacation.followersCount = Math.max(0, vacation.followersCount - 1);
        await this.vacationRepository.save(vacation);
        return {
            isFollowing: false,
            followersCount: vacation.followersCount
        };
    }
    async getFollowersStats() {
        return this.vacationRepository
            .createQueryBuilder('vacation')
            .select(['vacation.id', 'vacation.title', 'vacation.followersCount'])
            .orderBy('vacation.followersCount', 'DESC')
            .getMany();
    }
};
VacationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vacation_entity_1.Vacation)),
    __param(1, (0, typeorm_1.InjectRepository)(vacation_follow_entity_1.VacationFollow)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], VacationsService);
exports.VacationsService = VacationsService;
//# sourceMappingURL=vacations.service.js.map