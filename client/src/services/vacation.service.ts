/**
 * Vacation Service
 * 
 * Handles all vacation-related API calls
 * Features:
 * - CRUD operations for vacations
 * - Vacation following
 * - Image upload
 * - Statistics
 * - Pagination and filtering
 */

import axios from './axios.config';
import { Vacation, VacationFormData, VacationFilters, VacationStats } from '../types/vacation';

// API endpoints
const VACATION_API = {
  BASE: '/vacations',
  FOLLOW: (id: number) => `/vacations/${id}/follow`,
  UNFOLLOW: (id: number) => `/vacations/${id}/unfollow`,
  STATS: '/vacations/stats'
};

/**
 * Fetches all vacations with optional filters
 * @param filters Optional filters for vacations
 * @returns List of vacations
 */
const getVacations = async (filters?: VacationFilters): Promise<Vacation[]> => {
  try {
    const response = await axios.get(VACATION_API.BASE, { params: filters });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches a single vacation by ID
 * @param id Vacation ID
 * @returns Vacation details
 */
const getVacationById = async (id: number): Promise<Vacation> => {
  try {
    const response = await axios.get(`${VACATION_API.BASE}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Creates a new vacation
 * @param data Vacation form data
 * @returns Created vacation
 */
const createVacation = async (data: VacationFormData): Promise<Vacation> => {
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    });

    const response = await axios.post(VACATION_API.BASE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates an existing vacation
 * @param id Vacation ID
 * @param data Updated vacation data
 * @returns Updated vacation
 */
const updateVacation = async (id: number, data: VacationFormData): Promise<Vacation> => {
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    });

    const response = await axios.put(`${VACATION_API.BASE}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes a vacation
 * @param id Vacation ID
 */
const deleteVacation = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${VACATION_API.BASE}/${id}`);
  } catch (error) {
    throw error;
  }
};

/**
 * Follows a vacation
 * @param id Vacation ID
 */
const followVacation = async (id: number): Promise<void> => {
  try {
    await axios.post(VACATION_API.FOLLOW(id));
  } catch (error) {
    throw error;
  }
};

/**
 * Unfollows a vacation
 * @param id Vacation ID
 */
const unfollowVacation = async (id: number): Promise<void> => {
  try {
    await axios.delete(VACATION_API.UNFOLLOW(id));
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches vacation statistics
 * @returns Vacation statistics data
 */
const getVacationStats = async (): Promise<VacationStats[]> => {
  try {
    const response = await axios.get(VACATION_API.STATS);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get vacation statistics
 * @returns Promise with vacation statistics data
 */
const getStats = async (): Promise<{ destination: string; followers: number; }[]> => {
  try {
    const response = await axios.get('/vacations/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching vacation stats:', error);
    throw error;
  }
};

export const vacationService = {
  getVacations,
  getVacationById,
  createVacation,
  updateVacation,
  deleteVacation,
  followVacation,
  unfollowVacation,
  getVacationStats,
  getStats
}; 