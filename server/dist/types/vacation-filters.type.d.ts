export interface VacationFilters {
    startDate?: Date;
    endDate?: Date;
    minPrice?: number;
    maxPrice?: number;
    destination?: string;
    availableSpotsOnly?: boolean;
}
