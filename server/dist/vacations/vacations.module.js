"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VacationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const vacations_service_1 = require("./vacations.service");
const vacation_controller_1 = require("./vacation.controller");
const vacation_entity_1 = require("../entities/vacation.entity");
const vacation_follow_entity_1 = require("../entities/vacation-follow.entity");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
let VacationsModule = class VacationsModule {
};
VacationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([vacation_entity_1.Vacation, vacation_follow_entity_1.VacationFollow]),
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: './uploads/vacations',
                    filename: (req, file, callback) => {
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                        callback(null, `${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
                    }
                })
            })
        ],
        controllers: [vacation_controller_1.VacationController],
        providers: [vacations_service_1.VacationsService],
        exports: [vacations_service_1.VacationsService, typeorm_1.TypeOrmModule]
    })
], VacationsModule);
exports.VacationsModule = VacationsModule;
//# sourceMappingURL=vacations.module.js.map