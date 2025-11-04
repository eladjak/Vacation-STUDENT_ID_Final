import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';
export declare class IsAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
export declare const isAdmin: (req: Request, res: Response, next: Function) => void;
