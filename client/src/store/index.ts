/**
 * Redux Store Configuration
 * 
 * Central store configuration for the application
 * Features:
 * - Combined reducers setup
 * - Redux Toolkit configuration
 * - Redux DevTools integration
 * - Type definitions for state and dispatch
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import vacationReducer from './slices/vacationSlice';

/**
 * Configure and create the Redux store
 * Combines auth and vacation reducers
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    vacations: vacationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

/**
 * Type definition for the root state
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Type definition for dispatch function
 */
export type AppDispatch = typeof store.dispatch; 