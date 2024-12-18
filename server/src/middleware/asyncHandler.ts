/**
 * Asynchronous Route Handler Wrapper
 * 
 * Wraps async route handlers to properly catch and forward errors
 * to Express error handling middleware. Eliminates the need for
 * try-catch blocks in every async route handler.
 * 
 * Features:
 * - Automatic error catching
 * - Promise resolution
 * - TypeScript type safety
 * - Clean route handler code
 * 
 * Usage:
 * router.get('/route', asyncHandler(async (req, res) => {
 *   const data = await someAsyncOperation();
 *   res.json(data);
 * }));
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Type definition for async route handler functions
 * Ensures proper typing for Express request handlers that return Promises
 */
type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

/**
 * Async Handler Wrapper Function
 * 
 * Wraps an async function and ensures any errors are passed to Express error handler.
 * 
 * @param fn - Async route handler function to wrap
 * @returns Wrapped function that properly handles Promise rejection
 * 
 * Benefits:
 * - Removes need for try-catch in route handlers
 * - Ensures consistent error handling
 * - Maintains Express middleware chain
 */
export const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 