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
exports.auth = exports.AuthGuard = void 0;
const user_entity_1 = require("../entities/user.entity");
const data_source_1 = require("../config/data-source");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let AuthGuard = class AuthGuard {
    constructor() {
        this.jwtService = new jwt_1.JwtService({
            secret: process.env.JWT_SECRET
        });
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.UnauthorizedException('No token provided');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token);
            const userRepository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
            const user = await userRepository.findOne({ where: { id: payload.sub } });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            request.user = user;
            return true;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AuthGuard);
exports.AuthGuard = AuthGuard;
const auth = async (req, res, next) => {
    const guard = new AuthGuard();
    try {
        await guard.canActivate({
            switchToHttp: () => ({
                getRequest: () => req
            })
        });
        next();
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
};
exports.auth = auth;
//# sourceMappingURL=auth.js.map