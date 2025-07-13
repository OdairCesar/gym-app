import { useState, useCallback } from 'react'
import { Training } from '@/interfaces/Training'
import { trainingService } from '@/services/trainingService'
import { useApi } from './useApi'
import { ENV } from '@/constants/environment'

interface UseTrainingsReturn {
  // Estados
  trainings: Training[]
  loading: boolean

  // Funções
  fetchTrainings: () => Promise<void>
  fetchUserTraining: () => Promise<Training | null>
  fetchTrainingById: (trainingId: string) => Promise<Training | null>
  createTraining: (trainingData: Partial<Training>) => Promise<boolean>
  updateTraining: (
    trainingId: string,
    trainingData: Partial<Training>,
  ) => Promise<boolean>
  deleteTraining: (trainingId: string) => Promise<boolean>
  refreshTrainings: () => Promise<void>

  // Utilitários
  getTrainingById: (trainingId: string) => Training | undefined
  getTrainingsByTrainer: (trainerId: string) => Training[]
  getTrainingsByUser: (userId: string) => Training[]
  filterTrainings: (filters: {
    nome?: string
    treinador?: string
    user?: string
  }) => Training[]
}

export const useTrainings = (): UseTrainingsReturn => {
  const { executeWithAuth } = useApi()

  const [trainings, setTrainings] = useState<Training[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTrainings = useCallback(async () => {
    try {
      setLoading(true)
      const result = await executeWithAuth(
        (token) => trainingService.fetchTrainings(token),
        {
          showErrorAlert: true,
          errorMessage: 'Falha ao carregar treinos',
        },
      )

      if (result) {
        setTrainings(result)
      }
    } catch (error) {
      console.error('Erro ao carregar treinos:', error)
    } finally {
      setLoading(false)
    }
  }, [executeWithAuth])

  const fetchUserTraining = useCallback(async (): Promise<Training | null> => {
    try {
      setLoading(true)
      const result = await executeWithAuth(
        (token) => trainingService.fetchUserTraining(token),
        {
          showErrorAlert: true,
          errorMessage: 'Falha ao carregar treino do usuário',
        },
      )

      return result || null
    } catch (error) {
      console.error('Erro ao carregar treino do usuário:', error)
      return null
    } finally {
      setLoading(false)
    }
  }, [executeWithAuth])

  const fetchTrainingById = useCallback(
    async (trainingId: string): Promise<Training | null> => {
      try {
        setLoading(true)
        const result = await executeWithAuth(
          (token) => trainingService.getTrainingByIdFromApi(trainingId, token),
          {
            showErrorAlert: true,
            errorMessage: 'Falha ao carregar treino',
          },
        )

        return (result as Training) || null
      } catch (error) {
        console.error('Erro ao carregar treino:', error)
        return null
      } finally {
        setLoading(false)
      }
    },
    [executeWithAuth],
  )

  const createTraining = useCallback(
    async (trainingData: Partial<Training>): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => trainingService.createTraining(trainingData, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Treino criado com sucesso',
          errorMessage: 'Falha ao criar treino',
        },
      )

      if (result) {
        await fetchTrainings()
        return true
      }

      return false
    },
    [executeWithAuth, fetchTrainings],
  )

  const updateTraining = useCallback(
    async (
      trainingId: string,
      trainingData: Partial<Training>,
    ): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) =>
          trainingService.updateTraining(trainingId, trainingData, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Treino atualizado com sucesso',
          errorMessage: 'Falha ao atualizar treino',
        },
      )

      if (result) {
        await fetchTrainings()
        return true
      }

      return false
    },
    [executeWithAuth, fetchTrainings],
  )

  const deleteTraining = useCallback(
    async (trainingId: string): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => trainingService.deleteTraining(trainingId, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Treino deletado com sucesso',
          errorMessage: 'Falha ao deletar treino',
        },
      )

      if (result) {
        await fetchTrainings()
        return true
      }

      return false
    },
    [executeWithAuth, fetchTrainings],
  )

  const refreshTrainings = useCallback(async () => {
    await fetchTrainings()
  }, [fetchTrainings])

  // Funções utilitárias
  const getTrainingById = useCallback(
    (trainingId: string): Training | undefined => {
      return trainingService.getTrainingById(trainings, trainingId)
    },
    [trainings],
  )

  const getTrainingsByTrainer = useCallback(
    (trainerId: string): Training[] => {
      return trainingService.getTrainingsByTrainer(trainings, trainerId)
    },
    [trainings],
  )

  const getTrainingsByUser = useCallback(
    (userId: string): Training[] => {
      return trainingService.getTrainingsByUser(trainings, userId)
    },
    [trainings],
  )

  const filterTrainings = useCallback(
    (filters: {
      nome?: string
      treinador?: string
      user?: string
    }): Training[] => {
      return trainingService.filterTrainings(trainings, filters)
    },
    [trainings],
  )

  return {
    // Estados
    trainings,
    loading,

    // Funções
    fetchTrainings,
    fetchUserTraining,
    fetchTrainingById,
    createTraining,
    updateTraining,
    deleteTraining,
    refreshTrainings,

    // Utilitários
    getTrainingById,
    getTrainingsByTrainer,
    getTrainingsByUser,
    filterTrainings,
  }
}
