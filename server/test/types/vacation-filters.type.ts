/**
 * טיפוסים עבור פילטרים בבדיקות
 */
export interface VacationFilters {
  startDate?: Date;
  endDate?: Date;
  minPrice?: number;
  maxPrice?: number;
  destination?: string;
  availableSpotsOnly?: boolean;
}

export interface TestVacation {
  id: string;
  title: string;
  price: number;
  startDate: Date;
  remainingSpots?: number;
} 