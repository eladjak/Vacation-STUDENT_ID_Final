import axios from './axios.config';
import { Vacation, VacationResponse } from '../types';

export const vacationService = {
  async getAll(): Promise<VacationResponse> {
    try {
      console.log('Fetching all vacations...');
      const response = await axios.get<VacationResponse>('/api/v1/vacations');
      console.log('Received vacations:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching vacations:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Vacation> {
    try {
      const response = await axios.get<Vacation>(`/api/v1/vacations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching vacation ${id}:`, error);
      throw error;
    }
  },

  async create(formData: FormData): Promise<Vacation> {
    try {
      console.log('Creating new vacation...');
      const response = await axios.post<Vacation>('/api/v1/vacations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Vacation created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating vacation:', error);
      throw error;
    }
  },

  async update(id: number, formData: FormData): Promise<Vacation> {
    try {
      console.log(`Updating vacation ${id}...`);
      const response = await axios.put<Vacation>(`/api/v1/vacations/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Vacation updated:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating vacation ${id}:`, error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      console.log(`Deleting vacation ${id}...`);
      await axios.delete(`/api/v1/vacations/${id}`);
      console.log(`Vacation ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting vacation ${id}:`, error);
      throw error;
    }
  },

  async follow(id: number): Promise<void> {
    try {
      console.log(`Following vacation ${id}...`);
      await axios.post(`/api/v1/vacations/${id}/follow`);
      console.log(`Successfully followed vacation ${id}`);
    } catch (error) {
      console.error(`Error following vacation ${id}:`, error);
      throw error;
    }
  },

  async unfollow(id: number): Promise<void> {
    try {
      console.log(`Unfollowing vacation ${id}...`);
      await axios.delete(`/api/v1/vacations/${id}/follow`);
      console.log(`Successfully unfollowed vacation ${id}`);
    } catch (error) {
      console.error(`Error unfollowing vacation ${id}:`, error);
      throw error;
    }
  },

  async getStats(): Promise<{ destination: string; followers: number }[]> {
    try {
      console.log('Fetching vacation stats...');
      const response = await axios.get('/api/v1/vacations/stats/followers');
      console.log('Received stats:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching vacation stats:', error);
      throw error;
    }
  }
};

export default vacationService; 