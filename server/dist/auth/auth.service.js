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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async register(registrationData) {
        const existingUser = await this.usersService.findByEmail(registrationData.email);
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        if (!this.isPasswordStrong(registrationData.password)) {
            throw new common_1.BadRequestException('Password must be at least 8 characters long and contain uppercase, lowercase, number and special character');
        }
        const hashedPassword = await bcrypt.hash(registrationData.password, 12);
        const newUser = await this.usersService.create({
            ...registrationData,
            password: hashedPassword,
            role: 'user',
            isEmailVerified: false
        });
        await this.sendVerificationEmail(newUser);
        const token = await this.generateToken(newUser);
        const { password, ...userWithoutPassword } = newUser;
        return {
            user: userWithoutPassword,
            token
        };
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        throw new common_1.UnauthorizedException('Invalid credentials');
    }
    async generateToken(user) {
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role
        };
        return this.jwtService.sign(payload);
    }
    isPasswordStrong(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return (password.length >= minLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasNumbers &&
            hasSpecialChar);
    }
    async sendVerificationEmail(user) {
        console.log(`Verification email would be sent to ${user.email}`);
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map