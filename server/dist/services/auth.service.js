"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const User_1 = require("../entities/User");
const data_source_1 = require("../config/data-source");
const errorHandler_1 = require("../middleware/errorHandler");
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const logger_1 = require("../utils/logger");
class AuthService {
    constructor() {
        this.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    }
    async register(userData) {
        const existingUser = await this.userRepository.findOne({
            where: { email: userData.email }
        });
        if (existingUser) {
            throw new errorHandler_1.AppError(400, 'Email already exists');
        }
        const hashedPassword = await (0, bcryptjs_1.hash)(userData.password, 12);
        const user = this.userRepository.create({
            ...userData,
            password: hashedPassword
        });
        await this.userRepository.save(user);
        logger_1.logger.info(`New user registered: ${user.email}`);
        const token = this.generateToken(user);
        return { user, token };
    }
    async login(email, password) {
        const user = await this.userRepository.findOne({
            where: { email }
        });
        if (!user) {
            logger_1.logger.error(`Login failed: User not found - ${email}`);
            throw new errorHandler_1.AppError(401, 'Invalid credentials');
        }
        try {
            logger_1.logger.info(`Attempting password comparison for user ${email}`);
            logger_1.logger.info(`Input password length: ${password.length}`);
            logger_1.logger.info(`Stored hash: ${user.password}`);
            const isPasswordValid = await (0, bcryptjs_1.compare)(password, user.password);
            logger_1.logger.info(`Password comparison result: ${isPasswordValid}`);
            if (!isPasswordValid) {
                logger_1.logger.error(`Login failed: Invalid password for user - ${email}`);
                throw new errorHandler_1.AppError(401, 'Invalid credentials');
            }
            logger_1.logger.info(`User logged in successfully: ${email}`);
            const token = this.generateToken(user);
            return { user, token };
        }
        catch (error) {
            logger_1.logger.error(`Login error for user ${email}:`, error);
            throw new errorHandler_1.AppError(401, 'Invalid credentials');
        }
    }
    generateToken(user) {
        return (0, jsonwebtoken_1.sign)({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });
    }
    async refreshToken(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });
        if (!user) {
            throw new errorHandler_1.AppError(401, 'User not found');
        }
        return this.generateToken(user);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map