"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = require("express");
const cors_1 = require("cors");
const path_1 = require("path");
const data_source_1 = require("./config/data-source");
const auth_routes_1 = require("./routes/auth.routes");
const vacation_routes_1 = require("./routes/vacation.routes");
const auth_1 = require("./middleware/auth");
const seed_1 = require("./data/seed");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'uploads')));
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/vacations', auth_1.auth, vacation_routes_1.default);
data_source_1.AppDataSource.initialize()
    .then(async () => {
    console.log('Database connection initialized successfully');
    try {
        await (0, seed_1.seedDatabase)();
        console.log('Database seeded successfully');
    }
    catch (error) {
        console.error('Error seeding database:', error);
    }
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
    .catch((error) => {
    console.error('Error initializing database connection:', error);
});
//# sourceMappingURL=index.js.map