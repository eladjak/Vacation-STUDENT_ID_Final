"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("./errorHandler");
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const messages = errors.array().map(error => error.msg);
        throw new errorHandler_1.AppError(400, messages.join(', '));
    }
    next();
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map