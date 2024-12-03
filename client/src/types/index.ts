// Form Types
export interface VacationFormValues {
  destination: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  price: string;
  image: File | null;
}

// Entity Types
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Vacation {
  id: number;
  destination: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  imageUrl: string;
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

export interface VacationResponse {
  vacations: Vacation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} 