"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VacationService = void 0;
const Vacation_1 = require("../entities/Vacation");
const VacationFollow_1 = require("../entities/VacationFollow");
const User_1 = require("../entities/User");
const data_source_1 = require("../config/data-source");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
const csv_writer_1 = require("csv-writer");
const path_1 = require("path");
const promises_1 = require("fs/promises");
class VacationService {
    constructor() {
        this.vacationRepository = data_source_1.AppDataSource.getRepository(Vacation_1.Vacation);
        this.followRepository = data_source_1.AppDataSource.getRepository(VacationFollow_1.VacationFollow);
        this.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    }
    async deleteImageFile(imageUrl) {
        try {
            const imagePath = path_1.default.join(__dirname, '../../', imageUrl);
            await (0, promises_1.unlink)(imagePath);
            logger_1.logger.info(`Deleted image file: ${imagePath}`);
        }
        catch (error) {
            logger_1.logger.error(`Failed to delete image file: ${imageUrl}`, error);
        }
    }
    async getAllVacations(userId, page = 1, limit = 10, filters) {
        const skip = (page - 1) * limit;
        const queryBuilder = this.vacationRepository
            .createQueryBuilder('vacation')
            .leftJoinAndSelect('vacation.followers', 'followers')
            .loadRelationCountAndMap('vacation.followersCount', 'vacation.followers');
        if (filters?.followed) {
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
    async getVacationById(id) {
        const vacation = await this.vacationRepository.findOne({
            where: { id },
            relations: ['followers']
        });
        if (!vacation) {
            throw new errorHandler_1.AppError(404, 'Vacation not found');
        }
        return vacation;
    }
    async createVacation(vacationData) {
        const vacation = this.vacationRepository.create(vacationData);
        await this.vacationRepository.save(vacation);
        logger_1.logger.info(`New vacation created: ${vacation.destination}`);
        return vacation;
    }
    async updateVacation(id, vacationData) {
        const vacation = await this.getVacationById(id);
        if (vacationData.imageUrl && vacation.imageUrl && vacationData.imageUrl !== vacation.imageUrl) {
            await this.deleteImageFile(vacation.imageUrl);
        }
        Object.assign(vacation, vacationData);
        await this.vacationRepository.save(vacation);
        logger_1.logger.info(`Vacation updated: ${vacation.destination}`);
        return vacation;
    }
    async deleteVacation(id) {
        const vacation = await this.getVacationById(id);
        if (vacation.imageUrl) {
            await this.deleteImageFile(vacation.imageUrl);
        }
        await this.vacationRepository.remove(vacation);
        logger_1.logger.info(`Vacation deleted: ${vacation.destination}`);
    }
    async followVacation(vacationId, userId) {
        const vacation = await this.getVacationById(vacationId);
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new errorHandler_1.AppError(404, 'User not found');
        }
        const existingFollow = await this.followRepository.findOne({
            where: { vacation: { id: vacationId }, user: { id: userId } }
        });
        if (existingFollow) {
            throw new errorHandler_1.AppError(400, 'Already following this vacation');
        }
        const follow = this.followRepository.create({ vacation, user });
        await this.followRepository.save(follow);
        logger_1.logger.info(`User ${userId} followed vacation ${vacationId}`);
    }
    async unfollowVacation(vacationId, userId) {
        const follow = await this.followRepository.findOne({
            where: { vacation: { id: vacationId }, user: { id: userId } }
        });
        if (!follow) {
            throw new errorHandler_1.AppError(404, 'Not following this vacation');
        }
        await this.followRepository.remove(follow);
        logger_1.logger.info(`User ${userId} unfollowed vacation ${vacationId}`);
    }
    async getFollowersStats() {
        const stats = await this.vacationRepository
            .createQueryBuilder('vacation')
            .loadRelationCountAndMap('vacation.followersCount', 'vacation.followers')
            .getMany();
        return stats.map(vacation => ({
            destination: vacation.destination,
            followers: vacation.followersCount
        }));
    }
    async exportToCsv() {
        const stats = await this.getFollowersStats();
        const csvFilePath = path_1.default.join(__dirname, '../../uploads/vacation-stats.csv');
        const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
            path: csvFilePath,
            header: [
                { id: 'destination', title: 'Destination' },
                { id: 'followers', title: 'Followers' }
            ]
        });
        await csvWriter.writeRecords(stats);
        logger_1.logger.info('Vacation stats exported to CSV');
        return csvFilePath;
    }
}
exports.VacationService = VacationService;
//# sourceMappingURL=vacation.service.js.map