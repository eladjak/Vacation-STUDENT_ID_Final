"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validators_1 = require("../middleware/validators");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
// Routes
router.post('/register', validators_1.validateRegister, validate_1.validate, authController.register);
router.post('/login', validators_1.validateLogin, validate_1.validate, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map