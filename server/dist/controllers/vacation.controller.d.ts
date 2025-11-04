/// <reference types="multer" />
import { Request } from 'express';
import { VacationsService } from '../services/vacations.service';
import { CreateVacationDto, UpdateVacationDto, VacationResponseDto } from '../vacations/dto';
import { User } from '../entities/user.entity';
interface FilterOptions {
    followed?: boolean;
    active?: boolean;
    upcoming?: boolean;
}
export declare class VacationController {
    private readonly vacationsService;
    constructor(vacationsService: VacationsService);
    findAll(req: Request & {
        user: User;
    }, page: number, limit: number, filters: FilterOptions): Promise<{
        vacations: VacationResponseDto[];
        total: number;
    }>;
    findOne(id: string, req: Request & {
        user: User;
    }): Promise<VacationResponseDto>;
    create(createVacationDto: CreateVacationDto, files: Array<Express.Multer.File>): Promise<VacationResponseDto>;
    update(id: string, updateVacationDto: UpdateVacationDto, files: Array<Express.Multer.File>): Promise<VacationResponseDto>;
    remove(id: string): Promise<void>;
    follow(id: string, req: Request & {
        user: User;
    }): Promise<{
        isFollowing: boolean;
        followersCount: number;
    }>;
    unfollow(id: string, req: Request & {
        user: User;
    }): Promise<{
        isFollowing: boolean;
        followersCount: number;
    }>;
    getFollowersStats(): Promise<{
        destination: string;
        followersCount: string;
    }[]>;
}
export {};
