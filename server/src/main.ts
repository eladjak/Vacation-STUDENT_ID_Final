/**
 * Application Entry Point
 * 
 * Configures and bootstraps the NestJS application with all necessary
 * middleware, validation pipes, and global filters.
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { LoggerService } from './utils/logger.service';
import { logger, loggerStream } from './utils/logger';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as morgan from 'morgan';

async function bootstrap() {
  // Create the application instance
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
  });

  // Security middleware
  app.use(helmet());
  app.use(compression());

  // Request logging with Morgan
  app.use(morgan('combined', { stream: loggerStream }));

  // Enable CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have decorators
      transform: true, // Transform payloads to be objects typed according to their DTO classes
      forbidNonWhitelisted: true, // Throw errors when non-whitelisted properties are present
      transformOptions: {
        enableImplicitConversion: true, // Automatically transform primitive types
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Start the server
  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.info(`Application is running on: http://localhost:${port}`);
}

bootstrap(); 