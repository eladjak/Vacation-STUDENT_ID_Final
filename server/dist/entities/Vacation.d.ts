import { VacationFollow } from './VacationFollow';
export declare class Vacation {
    id: number;
    destination: string;
    description: string;
    startDate: Date;
    endDate: Date;
    price: number;
    imageUrl: string;
    followers: VacationFollow[];
    followersCount: number;
    createdAt: Date;
    updatedAt: Date;
    isFollowing?: boolean;
}
