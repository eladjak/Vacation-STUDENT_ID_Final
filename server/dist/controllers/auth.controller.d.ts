import { Request, Response } from 'express';
export declare class AuthController {
    private userRepository;
    constructor();
    login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getCurrentUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
