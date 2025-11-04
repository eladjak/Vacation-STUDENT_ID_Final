"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const validators_1 = require("../middleware/validators");
const validate_1 = require("../middleware/validate");
const asyncHandler_1 = require("../middleware/asyncHandler");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
router.get('/profile', auth_1.auth, (0, asyncHandler_1.asyncHandler)(userController.getProfile));
router.put('/profile', auth_1.auth, validators_1.validateUpdateProfile, validate_1.validate, (0, asyncHandler_1.asyncHandler)(userController.updateProfile));
router.put('/password', auth_1.auth, validators_1.validateChangePassword, validate_1.validate, (0, asyncHandler_1.asyncHandler)(userController.changePassword));
router.get('/vacations/followed', auth_1.auth, (0, asyncHandler_1.asyncHandler)(userController.getFollowedVacations));
exports.default = router;
//# sourceMappingURL=user.routes.js.map