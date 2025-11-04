/**
 * Transform Interceptor
 * 
 * Provides consistent response transformation across the application.
 * Wraps responses in a standard format and handles metadata.
 * 
 * Features:
 * - Standardized response format
 * - Response metadata
 * - Pagination support
 * - Response timing
 * - Data serialization
 */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  metadata: {
    timestamp: string;
    path: string;
    duration?: number;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    return next.handle().pipe(
      map(data => {
        const duration = Date.now() - startTime;
        const response: Response<T> = {
          data: this.transformData(data),
          metadata: {
            timestamp: new Date().toISOString(),
            path: request.url,
            duration,
          },
        };

        // Add pagination metadata if available
        if (data?.total !== undefined && data?.vacations) {
          const page = parseInt(request.query.page) || 1;
          const limit = parseInt(request.query.limit) || 10;
          response.metadata.pagination = {
            page,
            limit,
            total: data.total,
            totalPages: Math.ceil(data.total / limit),
          };
          response.data = data.vacations;
        }

        return response;
      }),
    );
  }

  private transformData(data: any): T {
    // Remove sensitive fields
    if (data) {
      if (Array.isArray(data)) {
        return data.map(item => this.removeSensitiveFields(item)) as T;
      } else {
        return this.removeSensitiveFields(data);
      }
    }
    return data;
  }

  private removeSensitiveFields(data: any): any {
    if (data && typeof data === 'object') {
      const { password, ...rest } = data;
      return rest;
    }
    return data;
  }
} 