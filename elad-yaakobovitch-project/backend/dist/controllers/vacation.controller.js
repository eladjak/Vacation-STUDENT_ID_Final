"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VacationController = void 0;
const vacation_service_1 = require("../services/vacation.service");
const logger_1 = require("../utils/logger");
class VacationController {
    constructor() {
        this.getAll = async (req, res) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filters = {
                followed: req.query.followed === 'true',
                active: req.query.active === 'true',
                upcoming: req.query.upcoming === 'true'
            };
            const { vacations, total } = await this.vacationService.getAllVacations(req.user.id, page, limit, filters);
            logger_1.logger.info(`Retrieved vacations list for user: ${req.user.id}`);
            res.json({
                vacations,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            });
        };
        this.getOne = async (req, res) => {
            const vacation = await this.vacationService.getVacationById(parseInt(req.params.id));
            logger_1.logger.info(`Retrieved vacation details: ${vacation.id}`);
            res.json(vacation);
        };
        this.create = async (req, res) => {
            const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
            const vacation = await this.vacationService.createVacation({
                ...req.body,
                imageUrl
            });
            logger_1.logger.info(`Created new vacation: ${vacation.id}`);
            res.status(201).json(vacation);
        };
        this.update = async (req, res) => {
            const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
            const vacation = await this.vacationService.updateVacation(parseInt(req.params.id), {
                ...req.body,
                ...(imageUrl && { imageUrl })
            });
            logger_1.logger.info(`Updated vacation: ${vacation.id}`);
            res.json(vacation);
        };
        this.delete = async (req, res) => {
            await this.vacationService.deleteVacation(parseInt(req.params.id));
            logger_1.logger.info(`Deleted vacation: ${req.params.id}`);
            res.status(204).send();
        };
        this.follow = async (req, res) => {
            await this.vacationService.followVacation(parseInt(req.params.id), req.user.id);
            logger_1.logger.info(`User ${req.user.id} followed vacation ${req.params.id}`);
            res.status(204).send();
        };
        this.unfollow = async (req, res) => {
            await this.vacationService.unfollowVacation(parseInt(req.params.id), req.user.id);
            logger_1.logger.info(`User ${req.user.id} unfollowed vacation ${req.params.id}`);
            res.status(204).send();
        };
        this.getFollowersStats = async (req, res) => {
            const stats = await this.vacationService.getFollowersStats();
            logger_1.logger.info('Retrieved vacation followers statistics');
            res.json(stats);
        };
        this.exportToCsv = async (req, res) => {
            const filePath = await this.vacationService.exportToCsv();
            logger_1.logger.info('Exported vacation statistics to CSV');
            res.download(filePath);
        };
        this.vacationService = new vacation_service_1.VacationService();
    }
}
exports.VacationController = VacationController;
//# sourceMappingURL=vacation.controller.js.map