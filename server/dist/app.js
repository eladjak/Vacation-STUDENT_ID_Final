"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeRoutes = exports.app = void 0;
const express_1 = require("express");
const cors_1 = require("cors");
const morgan_1 = require("morgan");
const helmet_1 = require("helmet");
const compression_1 = require("compression");
const path_1 = require("path");
const error_middleware_1 = require("./middleware/error.middleware");
const vacation_routes_1 = require("./routes/vacation.routes");
const auth_routes_1 = require("./routes/auth.routes");
const auth_1 = require("./middleware/auth");
const app = (0, express_1.default)();
exports.app = app;
const uploadsDir = path_1.default.join(__dirname, '..', 'uploads');
const vacationsUploadsDir = path_1.default.join(uploadsDir, 'vacations');
if (!require('fs').existsSync(uploadsDir)) {
    require('fs').mkdirSync(uploadsDir);
}
if (!require('fs').existsSync(vacationsUploadsDir)) {
    require('fs').mkdirSync(vacationsUploadsDir);
}
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, compression_1.default)());
if (process.env.NODE_ENV !== 'test') {
    app.use((0, morgan_1.default)('dev'));
}
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'uploads'), {
    setHeaders: (res) => {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Cache-Control', 'public, max-age=31536000');
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));
const initializeRoutes = () => {
    app.use('/api/v1/auth', auth_routes_1.default);
    app.use('/api/v1/vacations', auth_1.auth, vacation_routes_1.default);
};
exports.initializeRoutes = initializeRoutes;
app.use(error_middleware_1.errorHandler);
//# sourceMappingURL=app.js.map