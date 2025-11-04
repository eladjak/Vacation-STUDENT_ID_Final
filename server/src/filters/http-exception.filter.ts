/**
 * HTTP Exception Filter
 * 
 * Provides consistent error handling across the application.
 * Formats error responses and adds logging.
 * 
 * Features:
 * - Standardized error response format
 * - Error logging
 * - Stack trace in development mode
 * - Sensitive information filtering
 */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
    };

    // Add stack trace in development mode
    if (process.env.NODE_ENV === 'development' && exception instanceof Error) {
      errorResponse['stack'] = exception.stack;
    }

    // Log the error
    logger.error(`${request.method} ${request.url}`, {
      error: message,
      stack: exception instanceof Error ? exception.stack : undefined,
      body: request.body,
      params: request.params,
      query: request.query,
    });

    response.status(status).json(errorResponse);
  }
} 