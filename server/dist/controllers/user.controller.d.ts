import { Request, Response } from 'express';
export declare class UserController {
    private userService;
    constructor();
    getProfile: (req: Request, res: Response) => Promise<void>;
    updateProfile: (req: Request, res: Response) => Promise<void>;
    changePassword: (req: Request, res: Response) => Promise<void>;
    getFollowedVacations: (req: Request, res: Response) => Promise<void>;
}
