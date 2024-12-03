"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_1 = require("../entities/User");
const data_source_1 = require("../config/data-source");
const errorHandler_1 = require("../middleware/errorHandler");
const bcryptjs_1 = require("bcryptjs");
const logger_1 = require("../utils/logger");
class UserService {
    constructor() {
        this.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    }
    async findById(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['followedVacations']
        });
        if (!user) {
            throw new errorHandler_1.AppError(404, 'User not found');
        }
        return user;
    }
    async updateProfile(userId, userData) {
        const user = await this.findById(userId);
        if (userData.email && userData.email !== user.email) {
            const existingUser = await this.userRepository.findOne({
                where: { email: userData.email }
            });
            if (existingUser) {
                throw new errorHandler_1.AppError(400, 'Email already exists');
            }
        }
        Object.assign(user, userData);
        await this.userRepository.save(user);
        logger_1.logger.info(`User profile updated: ${user.email}`);
        return user;
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.findById(userId);
        const isPasswordValid = await (0, bcryptjs_1.compare)(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new errorHandler_1.AppError(401, 'Current password is incorrect');
        }
        user.password = await (0, bcryptjs_1.hash)(newPassword, 10);
        await this.userRepository.save(user);
        logger_1.logger.info(`Password changed for user: ${user.email}`);
    }
    async getFollowedVacations(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['followedVacations']
        });
        if (!user) {
            throw new errorHandler_1.AppError(404, 'User not found');
        }
        return user.followedVacations;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map