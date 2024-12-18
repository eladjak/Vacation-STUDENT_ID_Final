/**
 * Logger Configuration Module
 * 
 * Configures and exports a Winston logger instance for application-wide logging.
 * Provides structured logging with timestamps, error stacks, and multiple output targets.
 * 
 * Features:
 * - Console output with colors
 * - Error log file for errors
 * - Combined log file for all levels
 * - JSON formatting
 * - Timestamp inclusion
 * - Error stack traces
 * - Configurable log level via environment
 */

import winston from 'winston';
import { config } from 'dotenv';

config();

/**
 * Log Format Configuration
 * 
 * Combines multiple Winston formats:
 * - timestamp: Adds ISO timestamp to each log
 * - errors: Includes error stack traces
 * - json: Structures logs in JSON format
 */
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * Winston Logger Instance
 * 
 * Configured with multiple transports:
 * 1. Console: Colorized output for development
 * 2. Error File: Logs errors to 'logs/error.log'
 * 3. Combined File: All logs to 'logs/combined.log'
 * 
 * Log level is configurable via LOG_LEVEL environment variable
 * Defaults to 'info' if not specified
 */
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // Write all logs to console with colors
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // Write error logs to dedicated file
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    // Write all logs to combined file
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
}); 