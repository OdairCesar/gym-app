import { useState, useCallback } from 'react'
import { Training } from '@/interfaces/Training'
import { trainingService } from '@/services/trainingService'
import { useApi } from './useApi'
import { ENV } from '@/constants/environment'
import { extractList } from '@/utils/apiUtils'

interface UseTrainingsReturn {
  trainings: Training[]
  loading: boolean
  fetchTrainings: () => Promise<void>
  fetchTrainingsFiltered: (params: { userId?: number; coachId?: number; name?: string }) => Promise<void>
  fetchTrainingById: (trainingId: number) => Promise<Training | null>
  fetchUserTraining: (userId: number) => Promise<Training | null>
  fetchUserTrainings: (userId: number) => Promise<Training[]>
  createTraining: (trainingData: Partial<Training>) => Promise<boolean>
  updateTraining: (trainingId: number, trainingData: Partial<Training>) => Promise<boolean>
  deleteTraining: (trainingId: number) => Promise<boolean>
  refreshTrainings: () => Promise<void>
  filterTrainings: (filters: { name?: string }) => Training[]
}

export const useTrainings = (): UseTrainingsReturn => {
  const { executeWithAuth } = useApi()
  const [trainings, setTrainings] = useState<Training[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTrainings = useCallback(async () => {
    setLoading(true)
    try {
      const result = await executeWithAuth(
        (token) => trainingService.fetchTrainings(token),
        { showErrorAlert: true, errorMessage: 'Falha ao carregar treinos' },
      )
      if (result) setTrainings(extractList<Training>(result))
    } catch (error) {
      console.error('Erro ao carregar treinos:', error)
    } finally {
      setLoading(false)
    }
  }, [executeWithAuth])

  const fetchTrainingsFiltered = useCallback(
    async (params: { userId?: number; coachId?: number; name?: string }) => {
      setLoading(true)
      try {
        const result = await executeWithAuth(
          (token) => trainingService.fetchTrainingsFiltered(params, token),
          { showErrorAlert: true, errorMessage: 'Falha ao filtrar treinos' },
        )
        if (result) setTrainings(extractList<Training>(result))
      } catch (error) {
        console.error('Erro ao filtrar treinos:', error)
      } finally {
        setLoading(false)
      }
    },
    [executeWithAuth],
  )

  const fetchTrainingById = useCallback(async (trainingId: number): Promise<Training | null> => {
    setLoading(true)
    try {
      const result = await executeWithAuth(
        (token) => trainingService.fetchTrainingById(trainingId, token),
        { showErrorAlert: true, errorMessage: 'Falha ao carregar treino' },
      )
      return (result as Training) || null
    } catch (error) {
      console.error('Erro ao carregar treino:', error)
      return null
    } finally {
      setLoading(false)
    }
  }, [executeWithAuth])

  /**
   * Busca o primeiro treino que pertence ao userId.
   * Usado como fallback quando o User não tem trainingId vinculado.
   */
  const fetchUserTraining = useCallback(
    async (userId: number): Promise<Training | null> => {
      setLoading(true)
      try {
        const result = await executeWithAuth(
          (token) => trainingService.fetchTrainings(token),
          { showErrorAlert: false },
        )
        if (result) {
          const list = extractList<Training>(result)
          return list.find((t) => t.userId === userId) ?? null
        }
        return null
      } catch (error) {
        console.error('Erro ao buscar treino do usuário:', error)
        return null
      } finally {
        setLoading(false)
      }
    },
    [executeWithAuth],
  )

  /**
   * Busca TODOS os treinos que pertencem ao userId.
   */
  const fetchUserTrainings = useCallback(
    async (userId: number): Promise<Training[]> => {
      setLoading(true)
      try {
        const result = await executeWithAuth(
          (token) => trainingService.fetchTrainings(token),
          { showErrorAlert: false },
        )
        if (result) {
          const list = extractList<Training>(result)
          return list.filter((t) => t.userId === userId)
        }
        return []
      } catch (error) {
        console.error('Erro ao buscar treinos do usuário:', error)
        return []
      } finally {
        setLoading(false)
      }
    },
    [executeWithAuth],
  )

  const createTraining = useCallback(async (trainingData: Partial<Training>): Promise<boolean> => {
    const result = await executeWithAuth(
      (token) => trainingService.createTraining(trainingData, token),
      { showSuccessAlert: ENV.showSuccessAlerts, successMessage: 'Treino criado com sucesso', errorMessage: 'Falha ao criar treino' },
    )
    if (result) { await fetchTrainings(); return true }
    return false
  }, [executeWithAuth, fetchTrainings])

  const updateTraining = useCallback(async (trainingId: number, trainingData: Partial<Training>): Promise<boolean> => {
    const result = await executeWithAuth(
      (token) => trainingService.updateTraining(trainingId, trainingData, token),
      { showSuccessAlert: ENV.showSuccessAlerts, successMessage: 'Treino atualizado com sucesso', errorMessage: 'Falha ao atualizar treino' },
    )
    if (result) { await fetchTrainings(); return true }
    return false
  }, [executeWithAuth, fetchTrainings])

  const deleteTraining = useCallback(async (trainingId: number): Promise<boolean> => {
    const result = await executeWithAuth(
      (token) => trainingService.deleteTraining(trainingId, token),
      { showSuccessAlert: ENV.showSuccessAlerts, successMessage: 'Treino deletado com sucesso', errorMessage: 'Falha ao deletar treino' },
    )
    if (result !== null) { await fetchTrainings(); return true }
    return false
  }, [executeWithAuth, fetchTrainings])

  const refreshTrainings = useCallback(async () => {
    await fetchTrainings()
  }, [fetchTrainings])

  const filterTrainings = useCallback(
    (filters: { name?: string }): Training[] => {
      return trainingService.filterTrainings(trainings, filters)
    },
    [trainings],
  )

  return {
    trainings,
    loading,
    fetchTrainings,
    fetchTrainingsFiltered,
    fetchTrainingById,
    fetchUserTraining,
    fetchUserTrainings,
    createTraining,
    updateTraining,
    deleteTraining,
    refreshTrainings,
    filterTrainings,
  }
}