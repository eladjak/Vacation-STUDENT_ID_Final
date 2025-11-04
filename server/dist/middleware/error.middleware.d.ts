import { Request, Response, NextFunction } from 'express';
interface CustomError extends Error {
    status?: number;
    code?: string;
}
export declare const errorHandler: (err: CustomError, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export {};
