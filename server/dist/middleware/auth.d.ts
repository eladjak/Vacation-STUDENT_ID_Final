/// <reference types="passport" />
import { Request, Response } from 'express';
import { CanActivate, ExecutionContext } from '@nestjs/common';
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
export declare class AuthGuard implements CanActivate {
    private readonly jwtService;
    constructor();
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
export declare const auth: (req: Request, res: Response, next: Function) => Promise<void>;
