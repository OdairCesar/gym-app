import { apiService, ApiResponse } from './apiService'
import { API_ENDPOINTS } from '@/constants/api'
import { Gym, GymStats } from '@/interfaces/Gym'

export class GymService {
  async fetchGyms(token: string): Promise<ApiResponse<Gym[]>> {
    return apiService.get<Gym[]>(API_ENDPOINTS.GYMS, token)
  }

  async createGym(gymData: Partial<Gym>, token: string): Promise<ApiResponse<Gym>> {
    return apiService.post<Gym>(API_ENDPOINTS.GYMS, gymData, token)
  }

  async updateGym(gymId: number, gymData: Partial<Gym>, token: string): Promise<ApiResponse<Gym>> {
    return apiService.put<Gym>(API_ENDPOINTS.GYM_BY_ID(gymId), gymData, token)
  }

  async deleteGym(gymId: number, token: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(API_ENDPOINTS.GYM_BY_ID(gymId), token)
  }

  async getGymById(gymId: number, token: string): Promise<ApiResponse<Gym>> {
    return apiService.get<Gym>(API_ENDPOINTS.GYM_BY_ID(gymId), token)
  }

  async getGymStats(gymId: number, token: string): Promise<ApiResponse<GymStats>> {
    return apiService.get<GymStats>(API_ENDPOINTS.GYM_STATS(gymId), token)
  }
}

export const gymService = new GymService()
