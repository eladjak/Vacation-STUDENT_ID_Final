"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerStream = exports.logger = void 0;
const winston_1 = require("winston");
const path_1 = require("path");
const { combine, timestamp, printf, colorize, json } = winston_1.format;
const devConsoleFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
        msg += `\n${JSON.stringify(metadata, null, 2)}`;
    }
    return msg;
});
const logDir = (0, path_1.join)(__dirname, '../../logs');
const errorLogPath = (0, path_1.join)(logDir, 'error.log');
const combinedLogPath = (0, path_1.join)(logDir, 'combined.log');
const logger = (0, winston_1.createLogger)({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(timestamp(), json()),
    defaultMeta: {
        service: 'vacation-service',
        environment: process.env.NODE_ENV || 'development'
    },
    transports: [
        new winston_1.transports.File({
            filename: errorLogPath,
            level: 'error',
            maxsize: 5242880,
            maxFiles: 5,
        }),
        new winston_1.transports.File({
            filename: combinedLogPath,
            maxsize: 5242880,
            maxFiles: 5,
        }),
    ],
    exceptionHandlers: [
        new winston_1.transports.File({
            filename: (0, path_1.join)(logDir, 'exceptions.log'),
            maxsize: 5242880,
            maxFiles: 5,
        })
    ],
    rejectionHandlers: [
        new winston_1.transports.File({
            filename: (0, path_1.join)(logDir, 'rejections.log'),
            maxsize: 5242880,
            maxFiles: 5,
        })
    ],
});
exports.logger = logger;
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.transports.Console({
        format: combine(colorize(), timestamp(), devConsoleFormat),
    }));
}
const loggerStream = {
    write: (message) => {
        logger.info(message.trim());
    },
};
exports.loggerStream = loggerStream;
//# sourceMappingURL=logger.js.map