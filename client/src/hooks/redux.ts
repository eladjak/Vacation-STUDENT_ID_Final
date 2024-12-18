/**
 * Redux Hooks
 * 
 * Custom typed hooks for Redux state management
 * Features:
 * - Type-safe dispatch function
 * - Type-safe state selector
 * - Proper TypeScript support
 * - Integration with Redux DevTools
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';

/**
 * Custom hook for dispatching actions with proper typing
 * @returns Typed dispatch function
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Custom hook for selecting state with proper typing
 * @returns Typed selector function
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 