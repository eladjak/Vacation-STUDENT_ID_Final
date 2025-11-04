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
exports.VacationsService = void 0;
const common_1 = require("@nestjs/common");
const vacation_entity_1 = require("../entities/vacation.entity");
const vacation_follow_entity_1 = require("../entities/vacation-follow.entity");
const user_entity_1 = require("../entities/user.entity");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const logger_1 = require("../utils/logger");
const data_source_1 = require("../config/data-source");
let VacationsService = class VacationsService {
    constructor() {
        this.initializeRepositories();
    }
    async initializeRepositories() {
        const dataSource = await (0, data_source_1.initializeDataSource)();
        this.vacationRepository = dataSource.getRepository(vacation_entity_1.Vacation);
        this.followRepository = dataSource.getRepository(vacation_follow_entity_1.VacationFollow);
        this.userRepository = dataSource.getRepository(user_entity_1.User);
    }
    async findAll(userId, page = 1, limit = 10, filters) {
        const queryBuilder = this.vacationRepository.createQueryBuilder('vacation');
        const skip = (page - 1) * limit;
        if (filters?.followed && userId) {
            queryBuilder.innerJoin('vacation.followers', 'follower', 'follower.userId = :userId', { userId });
        }
        if (filters?.active) {
            const now = new Date();
            queryBuilder.andWhere('vacation.startDate <= :now AND vacation.endDate >= :now', { now });
        }
        if (filters?.upcoming) {
            const now = new Date();
            queryBuilder.andWhere('vacation.startDate > :now', { now });
        }
        const [vacations, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount();
        return { vacations, total };
    }
    async findOne(id) {
        const vacation = await this.vacationRepository.findOne({
            where: { id },
            relations: ['followers']
        });
        if (!vacation) {
            throw new common_1.NotFoundException(`Vacation with ID ${id} not found`);
        }
        return vacation;
    }
    async create(createVacationDto) {
        const vacation = this.vacationRepository.create({
            ...createVacationDto,
            followersCount: 0,
            currentParticipants: 0
        });
        if (vacation.startDate > vacation.endDate) {
            throw new common_1.BadRequestException('Start date must be before end date');
        }
        if (vacation.price < 0) {
            throw new common_1.BadRequestException('Price must be positive');
        }
        if (vacation.maxParticipants <= 0) {
            throw new common_1.BadRequestException('Maximum participants must be positive');
        }
        const savedVacation = await this.vacationRepository.save(vacation);
        logger_1.logger.info(`New vacation created: ${vacation.destination}`);
        return savedVacation;
    }
    async update(id, updateVacationDto) {
        const vacation = await this.findOne(id);
        if (updateVacationDto.startDate && updateVacationDto.endDate) {
            if (new Date(updateVacationDto.startDate) > new Date(updateVacationDto.endDate)) {
                throw new common_1.BadRequestException('Start date must be before end date');
            }
        }
        if (updateVacationDto.price !== undefined && updateVacationDto.price < 0) {
            throw new common_1.BadRequestException('Price must be positive');
        }
        if (updateVacationDto.maxParticipants !== undefined && updateVacationDto.maxParticipants <= 0) {
            throw new common_1.BadRequestException('Maximum participants must be positive');
        }
        if (updateVacationDto.imageUrls && vacation.imageUrls) {
            const removedImages = vacation.imageUrls.filter(url => !updateVacationDto.imageUrls?.includes(url));
            await Promise.all(removedImages.map(url => this.deleteImageFile(url)));
        }
        Object.assign(vacation, updateVacationDto);
        const savedVacation = await this.vacationRepository.save(vacation);
        logger_1.logger.info(`Vacation updated: ${vacation.destination}`);
        return savedVacation;
    }
    async remove(id) {
        const vacation = await this.findOne(id);
        if (vacation.imageUrls?.length) {
            await Promise.all(vacation.imageUrls.map(url => this.deleteImageFile(url)));
        }
        await this.vacationRepository.remove(vacation);
        logger_1.logger.info(`Vacation deleted: ${vacation.destination}`);
    }
    async follow(userId, vacationId) {
        const [user, vacation] = await Promise.all([
            this.userRepository.findOne({ where: { id: userId } }),
            this.findOne(vacationId)
        ]);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
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
        vacation.followersCount = (vacation.followersCount || 0) + 1;
        await this.vacationRepository.save(vacation);
        logger_1.logger.info(`User ${userId} followed vacation ${vacationId}`);
        return {
            isFollowing: true,
            followersCount: vacation.followersCount
        };
    }
    async unfollow(userId, vacationId) {
        const vacation = await this.findOne(vacationId);
        const follow = await this.followRepository.findOne({
            where: { userId, vacation: { id: vacationId } }
        });
        if (!follow) {
            throw new common_1.BadRequestException('Not following this vacation');
        }
        await this.followRepository.remove(follow);
        vacation.followersCount = Math.max(0, (vacation.followersCount || 0) - 1);
        await this.vacationRepository.save(vacation);
        logger_1.logger.info(`User ${userId} unfollowed vacation ${vacationId}`);
        return {
            isFollowing: false,
            followersCount: vacation.followersCount
        };
    }
    async getFollowersStats() {
        return this.vacationRepository
            .createQueryBuilder('vacation')
            .select(['vacation.destination', 'COUNT(followers.id) as followersCount'])
            .leftJoin('vacation.followers', 'followers')
            .groupBy('vacation.id')
            .getRawMany();
    }
    async deleteImageFile(imageUrl) {
        try {
            const imagePath = (0, path_1.join)(__dirname, '../../', imageUrl);
            await (0, promises_1.unlink)(imagePath);
            logger_1.logger.info(`Deleted image file: ${imagePath}`);
        }
        catch (error) {
            logger_1.logger.error(`Failed to delete image file: ${imageUrl}`, error);
        }
    }
};
VacationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], VacationsService);
exports.VacationsService = VacationsService;
//# sourceMappingURL=vacations.service.js.map