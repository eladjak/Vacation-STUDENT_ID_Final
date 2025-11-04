"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vacation_controller_1 = require("../controllers/vacation.controller");
const vacations_service_1 = require("../services/vacations.service");
const isAdmin_1 = require("../middleware/isAdmin");
const auth_1 = require("../middleware/auth");
const multer_1 = require("multer");
const path_1 = require("path");
const uuid_1 = require("uuid");
const path_2 = require("path");
const data_source_1 = require("../config/data-source");
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, (0, path_1.join)(__dirname, '../../uploads/vacations'));
    },
    filename: (req, file, cb) => {
        const uniqueName = `${(0, uuid_1.v4)()}${(0, path_2.extname)(file.originalname)}`;
        cb(null, uniqueName);
    }
});
const upload = (0, multer_1.default)({ storage });
let vacationsService;
let vacationController;
const initializeControllers = async () => {
    const dataSource = await (0, data_source_1.initializeDataSource)();
    vacationsService = new vacations_service_1.VacationsService();
    vacationController = new vacation_controller_1.VacationController(vacationsService);
};
initializeControllers().catch(console.error);
router.use(auth_1.AuthGuard);
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, followed, active, upcoming } = req.query;
        const result = await vacationController.findAll(req, Number(page), Number(limit), {
            followed: Boolean(followed),
            active: Boolean(active),
            upcoming: Boolean(upcoming)
        });
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const vacation = await vacationController.findOne(req.params.id, req.user?.id);
        res.json(vacation);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
});
router.post('/', isAdmin_1.IsAdminGuard, upload.array('images', 10), async (req, res) => {
    try {
        const files = req.files;
        const vacation = await vacationController.create(req.body, files);
        res.status(201).json(vacation);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.put('/:id', isAdmin_1.IsAdminGuard, upload.array('images', 10), async (req, res) => {
    try {
        const files = req.files;
        const vacation = await vacationController.update(req.params.id, req.body, files);
        res.json(vacation);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.delete('/:id', isAdmin_1.IsAdminGuard, async (req, res) => {
    try {
        await vacationController.remove(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post('/:id/follow', async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const result = await vacationController.follow(req.user.id, req.params.id);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.delete('/:id/follow', async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const result = await vacationController.unfollow(req.user.id, req.params.id);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.get('/stats/followers', isAdmin_1.IsAdminGuard, async (req, res) => {
    try {
        const stats = await vacationController.getFollowersStats();
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=vacation.routes.js.map