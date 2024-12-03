"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const logger_1 = require("../utils/logger");
class AuthController {
    constructor() {
        this.register = async (req, res) => {
            const result = await this.authService.register(req.body);
            res.status(201).json(result);
        };
        this.login = async (req, res) => {
            const { email, password } = req.body;
            logger_1.logger.info(`Login attempt for email: ${email}`);
            try {
                const result = await this.authService.login(email, password);
                logger_1.logger.info(`Login successful for user: ${email}`);
                res.json(result);
            }
            catch (error) {
                logger_1.logger.error(`Login failed for user: ${email}`, { error });
                throw error;
            }
        };
        this.refreshToken = async (req, res) => {
            const userId = req.user?.id;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const token = await this.authService.refreshToken(userId);
            res.json({ token });
        };
        this.logout = async (req, res) => {
            // In a real application, you might want to invalidate the token here
            logger_1.logger.info(`User logged out: ${req.user.id}`);
            res.json({ message: 'Logged out successfully' });
        };
        this.authService = new auth_service_1.AuthService();
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map