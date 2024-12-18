/**
 * Types for vacation search filters
 * Used to filter vacation listings based on user preferences
 */
export interface VacationFilters {
  /** Start date for vacation search range */
  startDate?: Date;
  
  /** End date for vacation search range */
  endDate?: Date;
  
  /** Minimum price filter */
  minPrice?: number;
  
  /** Maximum price filter */
  maxPrice?: number;
  
  /** Destination location filter */
  destination?: string;
  
  /** Filter for vacations with available spots only */
  availableSpotsOnly?: boolean;
} 