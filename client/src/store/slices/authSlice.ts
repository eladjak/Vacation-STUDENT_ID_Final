import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginSuccess } from '../../types';
import { authService } from '../../services/auth.service';

// Initialize state from authService
const initialState: AuthState = {
  user: authService.getUser(),
  token: authService.getToken(),
  loading: false,
  error: null,
  isAuthenticated: authService.isAuthenticated(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<LoginSuccess>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      state.isAuthenticated = true;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      
      // Clear session
      authService.logout();
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
      
      // Clear session
      authService.logout();
    },
    restoreAuth: (state) => {
      const user = authService.getUser();
      const token = authService.getToken();
      
      state.user = user;
      state.token = token;
      state.isAuthenticated = !!user && !!token;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, restoreAuth } = authSlice.actions;

export default authSlice.reducer; 