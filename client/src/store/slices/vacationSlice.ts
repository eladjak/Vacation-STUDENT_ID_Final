import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vacationService } from '../../services/vacation.service';
import { Vacation } from '../../types';

interface VacationsState {
  items: Vacation[];
  loading: boolean;
  error: string | null;
}

const initialState: VacationsState = {
  items: [],
  loading: false,
  error: null
};

export const fetchVacations = createAsyncThunk(
  'vacations/fetchVacations',
  async () => {
    return await vacationService.getAll();
  }
);

export const followVacation = createAsyncThunk(
  'vacations/followVacation',
  async (id: number) => {
    await vacationService.follow(id);
    return await vacationService.getAll();
  }
);

export const unfollowVacation = createAsyncThunk(
  'vacations/unfollowVacation',
  async (id: number) => {
    await vacationService.unfollow(id);
    return await vacationService.getAll();
  }
);

export const deleteVacation = createAsyncThunk(
  'vacations/deleteVacation',
  async (id: number) => {
    await vacationService.delete(id);
    return await vacationService.getAll();
  }
);

export const createVacation = createAsyncThunk(
  'vacations/createVacation',
  async (formData: FormData) => {
    await vacationService.create(formData);
    return await vacationService.getAll();
  }
);

const vacationsSlice = createSlice({
  name: 'vacations',
  initialState,
  reducers: {},
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
        state.error = null;
      })
      .addCase(fetchVacations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'שגיאה בטעינת החופשות';
      })
      // Follow vacation
      .addCase(followVacation.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Unfollow vacation
      .addCase(unfollowVacation.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Delete vacation
      .addCase(deleteVacation.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Create vacation
      .addCase(createVacation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVacation.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(createVacation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'שגיאה ביצירת החופשה';
      });
  },
});

export default vacationsSlice.reducer; 