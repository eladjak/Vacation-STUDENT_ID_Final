/**
 * Logger Service
 * 
 * Provides centralized logging functionality with different log levels
 * and formatting options.
 */
import { Injectable, Logger, LogLevel } from '@nestjs/common';
import * as winston from 'winston';
import { join } from 'path';

@Injectable()
export class LoggerService extends Logger {
  private readonly winstonLogger: winston.Logger;

  constructor() {
    super();

    this.winstonLogger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        // Write all logs to console
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
        // Write all logs with level 'info' and below to combined.log
        new winston.transports.File({
          filename: join(__dirname, '../../logs/combined.log'),
        }),
        // Write all errors to error.log
        new winston.transports.File({
          filename: join(__dirname, '../../logs/error.log'),
          level: 'error',
        }),
      ],
    });
  }

  /**
   * Log an informational message
   */
  info(message: string, context?: string) {
    this.winstonLogger.info(message, { context });
    super.log(message, context);
  }

  /**
   * Log an error message
   */
  error(message: string, trace?: string, context?: string) {
    this.winstonLogger.error(message, { trace, context });
    super.error(message, trace, context);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: string) {
    this.winstonLogger.warn(message, { context });
    super.warn(message, context);
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: string) {
    this.winstonLogger.debug(message, { context });
    super.debug(message, context);
  }

  /**
   * Log a verbose message
   */
  verbose(message: string, context?: string) {
    this.winstonLogger.verbose(message, { context });
    super.verbose(message, context);
  }
} 