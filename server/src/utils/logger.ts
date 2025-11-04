/**
 * Logger Utility
 * 
 * Provides centralized logging functionality for the application.
 * Uses Winston for logging with different transports and formats.
 * 
 * Features:
 * - Multiple log levels
 * - File and console logging
 * - JSON formatting
 * - Error stack traces
 * - Request context
 * - Environment-based configuration
 */
import { createLogger, format, transports } from 'winston';
import { join } from 'path';

const { combine, timestamp, printf, colorize, json } = format;

// Custom format for development console output
const devConsoleFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  
  if (Object.keys(metadata).length > 0) {
    msg += `\n${JSON.stringify(metadata, null, 2)}`;
  }
  
  return msg;
});

// Create log directory if it doesn't exist
const logDir = join(__dirname, '../../logs');
const errorLogPath = join(logDir, 'error.log');
const combinedLogPath = join(logDir, 'combined.log');

// Configure logger based on environment
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp(),
    json()
  ),
  defaultMeta: { 
    service: 'vacation-service',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Write all logs error (and below) to error.log
    new transports.File({ 
      filename: errorLogPath,
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write all logs to combined.log
    new transports.File({ 
      filename: combinedLogPath,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  exceptionHandlers: [
    new transports.File({ 
      filename: join(logDir, 'exceptions.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ],
  rejectionHandlers: [
    new transports.File({ 
      filename: join(logDir, 'rejections.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ],
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: combine(
      colorize(),
      timestamp(),
      devConsoleFormat
    ),
  }));
}

// Create a stream object with a 'write' function that will be used by Morgan
const loggerStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export { logger, loggerStream }; 