import axiosInstance from './axios.config';
import { Vacation, VacationResponse } from '../types';

interface StatsResponse {
  status: string;
  data: {
    stats: Array<{
      destination: string;
      followers: number;
    }>;
  };
}

export const vacationService = {
  async getAll(): Promise<Vacation[]> {
    try {
      console.log('Fetching all vacations...');
      const response = await axiosInstance.get<VacationResponse>('/vacations');
      console.log('Received vacations:', response.data);
      return response.data.data.vacations;
    } catch (error) {
      console.error('Error fetching vacations:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Vacation> {
    try {
      const response = await axiosInstance.get<{ status: string; data: { vacation: Vacation } }>(`/vacations/${id}`);
      return response.data.data.vacation;
    } catch (error) {
      console.error(`Error fetching vacation ${id}:`, error);
      throw error;
    }
  },

  async create(formData: FormData): Promise<Vacation> {
    try {
      console.log('Creating new vacation...');
      const response = await axiosInstance.post<{ status: string; data: { vacation: Vacation } }>('/vacations', formData);
      console.log('Vacation created:', response.data);
      return response.data.data.vacation;
    } catch (error) {
      console.error('Error creating vacation:', error);
      throw error;
    }
  },

  async update(id: number, formData: FormData): Promise<Vacation> {
    try {
      console.log(`Updating vacation ${id}...`);
      const response = await axiosInstance.put<{ status: string; data: { vacation: Vacation } }>(`/vacations/${id}`, formData);
      console.log('Vacation updated:', response.data);
      return response.data.data.vacation;
    } catch (error) {
      console.error(`Error updating vacation ${id}:`, error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      console.log(`Deleting vacation ${id}...`);
      await axiosInstance.delete(`/vacations/${id}`);
      console.log(`Vacation ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting vacation ${id}:`, error);
      throw error;
    }
  },

  async follow(id: number): Promise<void> {
    try {
      console.log(`Following vacation ${id}...`);
      await axiosInstance.post(`/vacations/${id}/follow`);
      console.log(`Successfully followed vacation ${id}`);
    } catch (error) {
      console.error(`Error following vacation ${id}:`, error);
      throw error;
    }
  },

  async unfollow(id: number): Promise<void> {
    try {
      console.log(`Unfollowing vacation ${id}...`);
      await axiosInstance.delete(`/vacations/${id}/follow`);
      console.log(`Successfully unfollowed vacation ${id}`);
    } catch (error) {
      console.error(`Error unfollowing vacation ${id}:`, error);
      throw error;
    }
  },

  async getStats(): Promise<{ destination: string; followers: number }[]> {
    try {
      console.log('Fetching vacation stats...');
      const response = await axiosInstance.get<StatsResponse>('/vacations/stats/followers');
      console.log('Received stats:', response.data);
      return response.data.data.stats;
    } catch (error) {
      console.error('Error fetching vacation stats:', error);
      throw error;
    }
  }
};

export default vacationService; 