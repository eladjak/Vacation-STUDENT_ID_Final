"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.IsAdminGuard = void 0;
const common_1 = require("@nestjs/common");
let IsAdminGuard = class IsAdminGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        if (!user.isAdmin()) {
            throw new common_1.UnauthorizedException('User is not an admin');
        }
        return true;
    }
};
IsAdminGuard = __decorate([
    (0, common_1.Injectable)()
], IsAdminGuard);
exports.IsAdminGuard = IsAdminGuard;
const isAdmin = (req, res, next) => {
    const guard = new IsAdminGuard();
    try {
        const result = guard.canActivate({
            switchToHttp: () => ({
                getRequest: () => req
            })
        });
        if (result) {
            next();
        }
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=isAdmin.js.map