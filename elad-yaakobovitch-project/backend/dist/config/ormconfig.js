"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ormconfig = void 0;
const dotenv_1 = require("dotenv");
// טעינת משתני הסביבה
(0, dotenv_1.config)();
exports.ormconfig = {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'haderech',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    entities: ['src/entities/**/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
    subscribers: ['src/subscribers/**/*.ts']
};
//# sourceMappingURL=ormconfig.js.map