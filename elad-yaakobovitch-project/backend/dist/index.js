"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const data_source_1 = require("./config/data-source");
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./utils/logger");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const vacation_routes_1 = __importDefault(require("./routes/vacation.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
// Load environment variables
(0, dotenv_1.config)();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/vacations', vacation_routes_1.default);
app.use('/api/v1/users', user_routes_1.default);
// Error handling
app.use(errorHandler_1.errorHandler);
// Database connection and server startup
const PORT = process.env.PORT || 3001;
data_source_1.AppDataSource.initialize()
    .then(() => {
    app.listen(PORT, () => {
        logger_1.logger.info(`Server is running on port ${PORT}`);
    });
})
    .catch((error) => {
    logger_1.logger.error('Database connection error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map