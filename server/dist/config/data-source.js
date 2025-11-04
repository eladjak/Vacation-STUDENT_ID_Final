"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = exports.getRepository = exports.initializeDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
(0, dotenv_1.config)();
const AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vacation_db',
    entities: [(0, path_1.join)(__dirname, '..', 'entities', '*.entity{.ts,.js}')],
    migrations: [(0, path_1.join)(__dirname, '..', 'migrations', '*{.ts,.js}')],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
    migrationsRun: true,
    migrationsTableName: 'migrations',
    charset: 'utf8mb4'
});
exports.AppDataSource = AppDataSource;
const initializeDataSource = async () => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log('Data Source has been initialized!');
        }
        return AppDataSource;
    }
    catch (error) {
        console.error('Error during Data Source initialization:', error);
        throw error;
    }
};
exports.initializeDataSource = initializeDataSource;
const getRepository = async (entity) => {
    const dataSource = await (0, exports.initializeDataSource)();
    return dataSource.getRepository(entity);
};
exports.getRepository = getRepository;
exports.default = AppDataSource;
//# sourceMappingURL=data-source.js.map