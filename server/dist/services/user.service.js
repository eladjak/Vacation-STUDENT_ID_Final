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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../entities/user.entity");
const data_source_1 = require("../config/data-source");
const bcrypt = require("bcrypt");
let UserService = class UserService {
    constructor() {
        this.userRepository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
    }
    async findById(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async updateProfile(id, updateData) {
        const user = await this.findById(id);
        delete updateData.password;
        delete updateData.role;
        Object.assign(user, updateData);
        return this.userRepository.save(user);
    }
    async changePassword(id, currentPassword, newPassword) {
        const user = await this.findById(id);
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await this.userRepository.save(user);
    }
    async getFollowedVacations(userId) {
        return this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.follows', 'follow')
            .leftJoinAndSelect('follow.vacation', 'vacation')
            .where('user.id = :userId', { userId })
            .getMany();
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map