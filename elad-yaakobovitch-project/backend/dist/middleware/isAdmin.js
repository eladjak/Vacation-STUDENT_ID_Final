"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const errorHandler_1 = require("./errorHandler");
const User_1 = require("../entities/User");
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return next(new errorHandler_1.AppError(401, 'Authentication required'));
    }
    if (req.user.role !== User_1.UserRole.ADMIN) {
        return next(new errorHandler_1.AppError(403, 'Admin access required'));
    }
    next();
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=isAdmin.js.map