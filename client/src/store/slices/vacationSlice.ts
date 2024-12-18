/**
 * Vacation Slice
 * 
 * Redux slice for managing vacation data
 * Features:
 * - Vacation list management
 * - Follow/unfollow functionality
 * - CRUD operations for vacations
 * - Loading states
 * - Error handling
 * - Pagination support
 * - Filter and sort capabilities
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { vacationService } from '../../services/vacation.service';
import { Vacation } from '../../types';

/**
 * Interface for vacation state
 */
interface VacationState {
  items: Vacation[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  filters: {
    followed: boolean;
    active: boolean;
    upcoming: boolean;
  };
}

/**
 * Initial vacation state
 */
const initialState: VacationState = {
  items: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  filters: {
    followed: false,
    active: false,
    upcoming: false,
  },
};

/**
 * Async thunk for fetching vacations
 */
export const fetchVacations = createAsyncThunk(
  'vacations/fetchVacations',
  async () => {
    const response = await vacationService.getAll();
    return response;
  }
);

/**
 * Async thunk for creating a vacation
 */
export const createVacation = createAsyncThunk(
  'vacations/createVacation',
  async (formData: FormData) => {
    const response = await vacationService.create(formData);
    return response;
  }
);

/**
 * Async thunk for updating a vacation
 */
export const updateVacation = createAsyncThunk(
  'vacations/updateVacation',
  async ({ id, formData }: { id: number; formData: FormData }) => {
    const response = await vacationService.update(id, formData);
    return response;
  }
);

/**
 * Async thunk for deleting a vacation
 */
export const deleteVacation = createAsyncThunk(
  'vacations/deleteVacation',
  async (id: number) => {
    await vacationService.delete(id);
    return id;
  }
);

/**
 * Async thunk for following a vacation
 */
export const followVacation = createAsyncThunk(
  'vacations/followVacation',
  async (id: number) => {
    await vacationService.followVacation(id);
    return id;
  }
);

/**
 * Async thunk for unfollowing a vacation
 */
export const unfollowVacation = createAsyncThunk(
  'vacations/unfollowVacation',
  async (id: number) => {
    await vacationService.unfollowVacation(id);
    return id;
  }
);

/**
 * Vacation slice configuration
 */
const vacationSlice = createSlice({
  name: 'vacations',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ key: keyof VacationState['filters']; value: boolean }>) => {
      state.filters[action.payload.key] = action.payload.value;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch vacations
      .addCase(fetchVacations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVacations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchVacations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'שגיאה בטעינת החופשות';
      })
      // Create vacation
      .addCase(createVacation.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update vacation
      .addCase(updateVacation.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete vacation
      .addCase(deleteVacation.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      // Follow vacation
      .addCase(followVacation.fulfilled, (state, action) => {
        const vacation = state.items.find(item => item.id === action.payload);
        if (vacation) {
          vacation.isFollowing = true;
          vacation.followersCount++;
        }
      })
      // Unfollow vacation
      .addCase(unfollowVacation.fulfilled, (state, action) => {
        const vacation = state.items.find(item => item.id === action.payload);
        if (vacation) {
          vacation.isFollowing = false;
          vacation.followersCount--;
        }
      });
  },
});

export const { setFilter, clearFilters, setPage } = vacationSlice.actions;
export default vacationSlice.reducer; 