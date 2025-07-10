import { apiService, ApiResponse } from './apiService'
import { API_ENDPOINTS } from '@/constants/api'
import { Training } from '@/interfaces/Training'

export class TrainingService {
  async fetchTrainings(token: string): Promise<ApiResponse<Training[]>> {
    return apiService.get<Training[]>(API_ENDPOINTS.TRAINING, token)
  }

  async fetchUserTraining(token: string): Promise<ApiResponse<Training>> {
    return apiService.get<Training>(API_ENDPOINTS.TRAINING_ME, token)
  }

  async createTraining(
    trainingData: Partial<Training>,
    token: string,
  ): Promise<ApiResponse<Training>> {
    return apiService.post<Training>(
      API_ENDPOINTS.TRAINING,
      trainingData,
      token,
    )
  }

  async updateTraining(
    trainingId: string,
    trainingData: Partial<Training>,
    token: string,
  ): Promise<ApiResponse<Training>> {
    return apiService.put<Training>(
      `${API_ENDPOINTS.TRAINING}/${trainingId}`,
      trainingData,
      token,
    )
  }

  async deleteTraining(
    trainingId: string,
    token: string,
  ): Promise<ApiResponse<void>> {
    return apiService.delete<void>(
      `${API_ENDPOINTS.TRAINING}/${trainingId}`,
      token,
    )
  }

  async getTrainingByIdFromApi(
    trainingId: string,
    token: string,
  ): Promise<ApiResponse<Training>> {
    return apiService.get<Training>(
      `${API_ENDPOINTS.TRAINING}/${trainingId}`,
      token,
    )
  }

  // Funções utilitárias para filtros e manipulação
  filterTrainings(
    trainings: Training[],
    filters: {
      nome?: string
      treinador?: string
      user?: string
    },
  ): Training[] {
    let filtered = [...trainings]

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((training) => {
          if (key === 'treinador') {
            return training.treinador === value
          } else if (key === 'user') {
            return training.user === value
          } else {
            const trainingValue = training[key as keyof Training]
            return trainingValue
              ?.toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          }
        })
      }
    })

    return filtered
  }

  getTrainingById(
    trainings: Training[],
    trainingId: string,
  ): Training | undefined {
    return trainings.find((training) => training._id === trainingId)
  }

  getTrainingsByTrainer(trainings: Training[], trainerId: string): Training[] {
    return trainings.filter((training) => training.treinador === trainerId)
  }

  getTrainingsByUser(trainings: Training[], userId: string): Training[] {
    return trainings.filter((training) => training.user === userId)
  }

  getExerciseCount(training: Training): number {
    return training.exercicios?.length || 0
  }

  searchTrainings(trainings: Training[], searchTerm: string): Training[] {
    if (!searchTerm) return trainings

    const term = searchTerm.toLowerCase()
    return trainings.filter(
      (training) =>
        training.nome.toLowerCase().includes(term) ||
        training.exercicios?.some((exercise) =>
          exercise.nome.toLowerCase().includes(term),
        ),
    )
  }
}

export const trainingService = new TrainingService()
