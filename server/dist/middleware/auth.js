"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("./errorHandler");
const user_service_1 = require("../services/user.service");
const auth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            throw new errorHandler_1.AppError(401, 'No token provided');
        }
        const token = authHeader.replace('Bearer ', '');
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userService = new user_service_1.UserService();
        const user = await userService.findById(decoded.id);
        if (!user) {
            throw new errorHandler_1.AppError(401, 'User not found');
        }
        req.user = {
            id: user.id,
            role: user.role
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new errorHandler_1.AppError(401, 'Invalid token'));
        }
        else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            next(new errorHandler_1.AppError(401, 'Token expired'));
        }
        else {
            next(error);
        }
    }
};
exports.auth = auth;
//# sourceMappingURL=auth.js.map