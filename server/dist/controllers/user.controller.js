"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const logger_1 = require("../utils/logger");
class UserController {
    constructor() {
        this.getProfile = async (req, res) => {
            const user = await this.userService.findById(req.user.id);
            logger_1.logger.info(`Retrieved profile for user: ${user.id}`);
            res.json(user);
        };
        this.updateProfile = async (req, res) => {
            const user = await this.userService.updateProfile(req.user.id, req.body);
            logger_1.logger.info(`Updated profile for user: ${user.id}`);
            res.json(user);
        };
        this.changePassword = async (req, res) => {
            const { currentPassword, newPassword } = req.body;
            await this.userService.changePassword(req.user.id, currentPassword, newPassword);
            logger_1.logger.info(`Changed password for user: ${req.user.id}`);
            res.json({ message: 'Password changed successfully' });
        };
        this.getFollowedVacations = async (req, res) => {
            const vacations = await this.userService.getFollowedVacations(req.user.id);
            logger_1.logger.info(`Retrieved followed vacations for user: ${req.user.id}`);
            res.json(vacations);
        };
        this.userService = new user_service_1.UserService();
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map