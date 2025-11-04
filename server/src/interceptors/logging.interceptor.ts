/**
 * Logging Interceptor
 * 
 * Provides request and response logging across the application.
 * Tracks request timing and adds correlation IDs.
 * 
 * Features:
 * - Request/response logging
 * - Request timing
 * - Correlation ID tracking
 * - Performance monitoring
 * - Request context preservation
 */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const correlationId = uuidv4();
    const startTime = Date.now();

    // Add correlation ID to request headers
    request.headers['x-correlation-id'] = correlationId;

    // Log the incoming request
    logger.info(`Incoming Request`, {
      correlationId,
      method,
      url,
      body,
      query,
      params,
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          // Log the response
          logger.info(`Outgoing Response`, {
            correlationId,
            method,
            url,
            duration,
            statusCode: context.switchToHttp().getResponse().statusCode,
            responseSize: JSON.stringify(data).length,
          });
        },
        error: (error) => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          // Log the error
          logger.error(`Request Error`, {
            correlationId,
            method,
            url,
            duration,
            error: error.message,
            stack: error.stack,
          });
        },
      })
    );
  }
} 