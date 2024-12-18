"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json());
exports.logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports: [
        // Write all logs to console
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
        }),
        // Write all logs with level 'error' and below to 'error.log'
        new winston_1.default.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        // Write all logs to 'combined.log'
        new winston_1.default.transports.File({
            filename: 'logs/combined.log'
        })
    ]
});
//# sourceMappingURL=logger.js.map