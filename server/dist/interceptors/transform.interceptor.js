"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let TransformInterceptor = class TransformInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const startTime = Date.now();
        return next.handle().pipe((0, operators_1.map)(data => {
            const duration = Date.now() - startTime;
            const response = {
                data: this.transformData(data),
                metadata: {
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    duration,
                },
            };
            if (data?.total !== undefined && data?.vacations) {
                const page = parseInt(request.query.page) || 1;
                const limit = parseInt(request.query.limit) || 10;
                response.metadata.pagination = {
                    page,
                    limit,
                    total: data.total,
                    totalPages: Math.ceil(data.total / limit),
                };
                response.data = data.vacations;
            }
            return response;
        }));
    }
    transformData(data) {
        if (data) {
            if (Array.isArray(data)) {
                return data.map(item => this.removeSensitiveFields(item));
            }
            else {
                return this.removeSensitiveFields(data);
            }
        }
        return data;
    }
    removeSensitiveFields(data) {
        if (data && typeof data === 'object') {
            const { password, ...rest } = data;
            return rest;
        }
        return data;
    }
};
TransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], TransformInterceptor);
exports.TransformInterceptor = TransformInterceptor;
//# sourceMappingURL=transform.interceptor.js.map