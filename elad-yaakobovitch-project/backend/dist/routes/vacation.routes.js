"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vacation_controller_1 = require("../controllers/vacation.controller");
const validators_1 = require("../middleware/validators");
const validate_1 = require("../middleware/validate");
const asyncHandler_1 = require("../middleware/asyncHandler");
const auth_1 = require("../middleware/auth");
const isAdmin_1 = require("../middleware/isAdmin");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
const vacationController = new vacation_controller_1.VacationController();
// Get all vacations (with pagination and filters)
router.get('/', auth_1.auth, (0, asyncHandler_1.asyncHandler)(vacationController.getAll));
// Get single vacation
router.get('/:id', auth_1.auth, (0, asyncHandler_1.asyncHandler)(vacationController.getOne));
// Create new vacation (admin only)
router.post('/', auth_1.auth, isAdmin_1.isAdmin, upload_1.upload.single('image'), validators_1.validateVacation, validate_1.validate, (0, asyncHandler_1.asyncHandler)(vacationController.create));
// Update vacation (admin only)
router.put('/:id', auth_1.auth, isAdmin_1.isAdmin, upload_1.upload.single('image'), validators_1.validateVacation, validate_1.validate, (0, asyncHandler_1.asyncHandler)(vacationController.update));
// Delete vacation (admin only)
router.delete('/:id', auth_1.auth, isAdmin_1.isAdmin, (0, asyncHandler_1.asyncHandler)(vacationController.delete));
// Follow vacation
router.post('/:id/follow', auth_1.auth, (0, asyncHandler_1.asyncHandler)(vacationController.follow));
// Unfollow vacation
router.delete('/:id/follow', auth_1.auth, (0, asyncHandler_1.asyncHandler)(vacationController.unfollow));
// Get vacation statistics (admin only)
router.get('/stats/followers', auth_1.auth, isAdmin_1.isAdmin, (0, asyncHandler_1.asyncHandler)(vacationController.getFollowersStats));
// Export vacations to CSV (admin only)
router.get('/export/csv', auth_1.auth, isAdmin_1.isAdmin, (0, asyncHandler_1.asyncHandler)(vacationController.exportToCsv));
exports.default = router;
//# sourceMappingURL=vacation.routes.js.map