"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const uuid_1 = require("uuid");
const logger_1 = require("../utils/logger");
let LoggingInterceptor = class LoggingInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, query, params } = request;
        const correlationId = (0, uuid_1.v4)();
        const startTime = Date.now();
        request.headers['x-correlation-id'] = correlationId;
        logger_1.logger.info(`Incoming Request`, {
            correlationId,
            method,
            url,
            body,
            query,
            params,
        });
        return next.handle().pipe((0, operators_1.tap)({
            next: (data) => {
                const endTime = Date.now();
                const duration = endTime - startTime;
                logger_1.logger.info(`Outgoing Response`, {
                    correlationId,
                    method,
                    url,
                    duration,
                    statusCode: context.switchToHttp().getResponse().statusCode,
                    responseSize: JSON.stringify(data).length,
                });
            },
            error: (error) => {
                const endTime = Date.now();
                const duration = endTime - startTime;
                logger_1.logger.error(`Request Error`, {
                    correlationId,
                    method,
                    url,
                    duration,
                    error: error.message,
                    stack: error.stack,
                });
            },
        }));
    }
};
LoggingInterceptor = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);
exports.LoggingInterceptor = LoggingInterceptor;
//# sourceMappingURL=logging.interceptor.js.map