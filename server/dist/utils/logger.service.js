"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const winston = require("winston");
const path_1 = require("path");
let LoggerService = class LoggerService extends common_1.Logger {
    constructor() {
        super();
        this.winstonLogger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
                }),
                new winston.transports.File({
                    filename: (0, path_1.join)(__dirname, '../../logs/combined.log'),
                }),
                new winston.transports.File({
                    filename: (0, path_1.join)(__dirname, '../../logs/error.log'),
                    level: 'error',
                }),
            ],
        });
    }
    info(message, context) {
        this.winstonLogger.info(message, { context });
        super.log(message, context);
    }
    error(message, trace, context) {
        this.winstonLogger.error(message, { trace, context });
        super.error(message, trace, context);
    }
    warn(message, context) {
        this.winstonLogger.warn(message, { context });
        super.warn(message, context);
    }
    debug(message, context) {
        this.winstonLogger.debug(message, { context });
        super.debug(message, context);
    }
    verbose(message, context) {
        this.winstonLogger.verbose(message, { context });
        super.verbose(message, context);
    }
};
LoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LoggerService);
exports.LoggerService = LoggerService;
//# sourceMappingURL=logger.service.js.map