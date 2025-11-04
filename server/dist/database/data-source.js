"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeConnection = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
(0, dotenv_1.config)({ path: (0, path_1.join)(__dirname, '../../.env') });
const AppDataSource = {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vacation_db',
    entities: [(0, path_1.join)(__dirname, '..', 'entities', '*.entity{.ts,.js}')],
    migrations: [(0, path_1.join)(__dirname, '..', 'migrations', '*{.ts,.js}')],
    synchronize: false,
    logging: true,
    migrationsRun: true,
    migrationsTableName: 'migrations',
    cli: {
        migrationsDir: 'src/migrations',
        entitiesDir: 'src/entities'
    },
    extra: {
        charset: 'utf8mb4_unicode_ci'
    }
};
exports.AppDataSource = AppDataSource;
let connection;
async function initializeConnection() {
    try {
        connection = (0, typeorm_1.createConnection)(AppDataSource);
        console.log('Data Source has been initialized!');
        return connection;
    }
    catch (err) {
        console.error('Error during Data Source initialization:', err);
        throw err;
    }
}
exports.initializeConnection = initializeConnection;
exports.default = AppDataSource;
//# sourceMappingURL=data-source.js.map