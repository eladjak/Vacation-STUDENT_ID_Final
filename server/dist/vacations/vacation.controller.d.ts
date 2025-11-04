/// <reference types="multer" />
import { Request } from 'express';
import { VacationsService } from './vacations.service';
import { CreateVacationDto, UpdateVacationDto, VacationResponseDto } from './dto';
export declare class VacationController {
    private readonly vacationsService;
    constructor(vacationsService: VacationsService);
    private mapToResponseDto;
    getAll(req: Request): Promise<VacationResponseDto[]>;
    getOne(id: string): Promise<VacationResponseDto>;
    create(createVacationDto: CreateVacationDto, files: Array<Express.Multer.File>): Promise<VacationResponseDto>;
    update(id: string, updateVacationDto: UpdateVacationDto, files: Array<Express.Multer.File>): Promise<VacationResponseDto>;
    remove(id: string): Promise<void>;
    follow(id: string, req: Request): Promise<{
        isFollowing: boolean;
        followersCount: number;
    }>;
    unfollow(id: string, req: Request): Promise<{
        isFollowing: boolean;
        followersCount: number;
    }>;
    getFollowersStats(): Promise<any[]>;
}
