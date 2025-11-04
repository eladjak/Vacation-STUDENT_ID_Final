"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const platform_express_1 = require("@nestjs/platform-express");
const serve_static_1 = require("@nestjs/serve-static");
const core_1 = require("@nestjs/core");
const path_1 = require("path");
const multer_1 = require("multer");
const uuid_1 = require("uuid");
const path_2 = require("path");
const auth_controller_1 = require("./controllers/auth.controller");
const user_controller_1 = require("./controllers/user.controller");
const vacation_controller_1 = require("./controllers/vacation.controller");
const auth_service_1 = require("./auth/auth.service");
const users_service_1 = require("./users/users.service");
const vacations_service_1 = require("./services/vacations.service");
const user_entity_1 = require("./entities/user.entity");
const vacation_entity_1 = require("./entities/vacation.entity");
const vacation_follow_entity_1 = require("./entities/vacation-follow.entity");
const http_exception_filter_1 = require("./filters/http-exception.filter");
const logging_interceptor_1 = require("./interceptors/logging.interceptor");
const transform_interceptor_1 = require("./interceptors/transform.interceptor");
const multerConfig = {
    storage: (0, multer_1.diskStorage)({
        destination: './uploads',
        filename: (req, file, cb) => {
            const uniqueName = `${(0, uuid_1.v4)()}${(0, path_2.extname)(file.originalname)}`;
            cb(null, uniqueName);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
};
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_DATABASE'),
                    entities: [user_entity_1.User, vacation_entity_1.Vacation, vacation_follow_entity_1.VacationFollow],
                    synchronize: configService.get('NODE_ENV') !== 'production',
                    logging: configService.get('NODE_ENV') === 'development',
                    charset: 'utf8mb4',
                    timezone: 'Z',
                    ssl: configService.get('NODE_ENV') === 'production',
                }),
                inject: [config_1.ConfigService],
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, vacation_entity_1.Vacation, vacation_follow_entity_1.VacationFollow]),
            platform_express_1.MulterModule.register(multerConfig),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'uploads'),
                serveRoot: '/uploads',
                serveStaticOptions: {
                    index: false,
                    maxAge: '1d',
                },
            }),
        ],
        controllers: [
            auth_controller_1.AuthController,
            user_controller_1.UserController,
            vacation_controller_1.VacationController
        ],
        providers: [
            auth_service_1.AuthService,
            users_service_1.UsersService,
            vacations_service_1.VacationsService,
            {
                provide: core_1.APP_PIPE,
                useValue: new common_1.ValidationPipe({
                    whitelist: true,
                    transform: true,
                    forbidNonWhitelisted: true,
                    transformOptions: {
                        enableImplicitConversion: true,
                    },
                }),
            },
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.HttpExceptionFilter,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_interceptor_1.LoggingInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: transform_interceptor_1.TransformInterceptor,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map