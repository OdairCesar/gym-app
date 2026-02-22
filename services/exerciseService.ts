import { apiService, ApiResponse } from './apiService'
import { API_ENDPOINTS } from '@/constants/api'
import { Exercise } from '@/interfaces/Exercise'

export class ExerciseService {
  async fetchExercises(token: string): Promise<ApiResponse<Exercise[]>> {
    return apiService.get<Exercise[]>(API_ENDPOINTS.EXERCISES, token)
  }

  async fetchExerciseById(
    exerciseId: number,
    token: string,
  ): Promise<ApiResponse<Exercise>> {
    return apiService.get<Exercise>(
      API_ENDPOINTS.EXERCISE_BY_ID(exerciseId),
      token,
    )
  }

  async createExercise(
    exerciseData: Partial<Exercise>,
    token: string,
  ): Promise<ApiResponse<Exercise>> {
    return apiService.post<Exercise>(
      API_ENDPOINTS.EXERCISES,
      exerciseData,
      token,
    )
  }

  async updateExercise(
    exerciseId: number,
    exerciseData: Partial<Exercise>,
    token: string,
  ): Promise<ApiResponse<Exercise>> {
    return apiService.put<Exercise>(
      API_ENDPOINTS.EXERCISE_BY_ID(exerciseId),
      exerciseData,
      token,
    )
  }

  async deleteExercise(
    exerciseId: number,
    token: string,
  ): Promise<ApiResponse<void>> {
    return apiService.delete<void>(
      API_ENDPOINTS.EXERCISE_BY_ID(exerciseId),
      token,
    )
  }

  async fetchTrainingExercises(
    trainingId: number,
    token: string,
  ): Promise<ApiResponse<Exercise[]>> {
    return apiService.get<Exercise[]>(
      API_ENDPOINTS.TRAINING_EXERCISES(trainingId),
      token,
    )
  }

  async addExerciseToTraining(
    trainingId: number,
    exerciseId: number,
    token: string,
  ): Promise<ApiResponse<void>> {
    return apiService.post<void>(
      API_ENDPOINTS.TRAINING_EXERCISES(trainingId),
      { exerciseId },
      token,
    )
  }

  async removeExerciseFromTraining(
    trainingId: number,
    exerciseId: number,
    token: string,
  ): Promise<ApiResponse<void>> {
    return apiService.delete<void>(
      API_ENDPOINTS.TRAINING_EXERCISE_BY_ID(trainingId, exerciseId),
      token,
    )
  }
}

export const exerciseService = new ExerciseService()
