"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const User_1 = require("../entities/User");
const Vacation_1 = require("../entities/Vacation");
const VacationFollow_1 = require("../entities/VacationFollow");
const path_1 = __importDefault(require("path"));
// Load environment variables
(0, dotenv_1.config)();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'vacation_db',
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    entities: [User_1.User, Vacation_1.Vacation, VacationFollow_1.VacationFollow],
    migrations: [path_1.default.join(__dirname, '../migrations/*.ts')],
    subscribers: [path_1.default.join(__dirname, '../subscribers/*.ts')]
});
//# sourceMappingURL=data-source.js.map