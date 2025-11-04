"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./filters/http-exception.filter");
const logger_service_1 = require("./utils/logger.service");
const logger_1 = require("./utils/logger");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: new logger_service_1.LoggerService(),
    });
    app.use(helmet());
    app.use(compression());
    app.use(morgan('combined', { stream: logger_1.loggerStream }));
    app.enableCors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger_1.logger.info(`Application is running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map