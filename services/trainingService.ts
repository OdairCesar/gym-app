import { apiService, ApiResponse } from './apiService'
import { API_ENDPOINTS } from '@/constants/api'
import { Training } from '@/interfaces/Training'

export class TrainingService {
  async fetchTrainings(token: string): Promise<ApiResponse<Training[]>> {
    return apiService.get<Training[]>(API_ENDPOINTS.TRAININGS, token)
  }

  async fetchTrainingsFiltered(
    params: { userId?: number; coachId?: number; name?: string },
    token: string,
  ): Promise<ApiResponse<Training[]>> {
    const qs = new URLSearchParams()
    if (params.userId) qs.append('user_id', String(params.userId))
    if (params.coachId) qs.append('coach_id', String(params.coachId))
    if (params.name) qs.append('name', params.name)
    const query = qs.toString()
    const url = query ? `${API_ENDPOINTS.TRAININGS}?${query}` : API_ENDPOINTS.TRAININGS
    return apiService.get<Training[]>(url, token)
  }

  async fetchTrainingById(
    trainingId: number,
    token: string,
  ): Promise<ApiResponse<Training>> {
    return apiService.get<Training>(API_ENDPOINTS.TRAINING_BY_ID(trainingId), token)
  }

  async createTraining(
    trainingData: Partial<Training>,
    token: string,
  ): Promise<ApiResponse<Training>> {
    return apiService.post<Training>(API_ENDPOINTS.TRAININGS, trainingData, token)
  }

  async updateTraining(
    trainingId: number,
    trainingData: Partial<Training>,
    token: string,
  ): Promise<ApiResponse<Training>> {
    return apiService.put<Training>(
      API_ENDPOINTS.TRAINING_BY_ID(trainingId),
      trainingData,
      token,
    )
  }

  async deleteTraining(trainingId: number, token: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(API_ENDPOINTS.TRAINING_BY_ID(trainingId), token)
  }

  filterTrainings(
    trainings: Training[],
    filters: { name?: string },
  ): Training[] {
    return trainings.filter((t) => {
      if (filters.name && !t.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false
      }
      return true
    })
  }
}

export const trainingService = new TrainingService()