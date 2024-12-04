// Form Types
export interface VacationFormValues {
  destination: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  price: number;
  image: File | null;
}

// Entity Types
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface Vacation {
  id: number;
  destination: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  imageUrl: string | null;
  followersCount: number;
  isFollowing?: boolean;
}

// State Types
export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Request/Response Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
}

export interface LoginSuccess {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
}

export interface VacationResponse extends ApiResponse<{
  vacations: Vacation[];
}> {}

export interface VacationStatsResponse extends ApiResponse<{
  stats: Array<{
    destination: string;
    followers: number;
  }>;
}> {}

// Router Types
export interface Location {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
  key: string;
}

export interface BlockerFunction {
  currentLocation: Location;
  nextLocation: Location;
} 