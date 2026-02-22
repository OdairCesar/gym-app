import { useState, useCallback } from 'react'
import { Gym, GymStats } from '@/interfaces/Gym'
import { gymService } from '@/services/gymService'
import { useApi } from './useApi'
import { ENV } from '@/constants/environment'
import { extractList } from '@/utils/apiUtils'

interface UseGymsReturn {
  gyms: Gym[]
  gymStats: GymStats | null
  loading: boolean

  fetchGyms: () => Promise<void>
  createGym: (gymData: Partial<Gym>) => Promise<boolean>
  updateGym: (gymId: number, gymData: Partial<Gym>) => Promise<boolean>
  deleteGym: (gymId: number) => Promise<boolean>
  fetchGymStats: (gymId: number) => Promise<GymStats | null>
}

export const useGyms = (): UseGymsReturn => {
  const { executeWithAuth } = useApi()

  const [gyms, setGyms] = useState<Gym[]>([])
  const [gymStats, setGymStats] = useState<GymStats | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchGyms = useCallback(async () => {
    try {
      setLoading(true)
      const result = await executeWithAuth(
        (token) => gymService.fetchGyms(token),
        { showErrorAlert: true, errorMessage: 'Falha ao carregar academias' },
      )
      if (result) setGyms(extractList<Gym>(result))
    } catch (error) {
      console.error('Erro ao carregar academias:', error)
    } finally {
      setLoading(false)
    }
  }, [executeWithAuth])

  const createGym = useCallback(
    async (gymData: Partial<Gym>): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => gymService.createGym(gymData, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Academia criada com sucesso',
          errorMessage: 'Falha ao criar academia',
        },
      )
      if (result) {
        await fetchGyms()
        return true
      }
      return false
    },
    [executeWithAuth, fetchGyms],
  )

  const updateGym = useCallback(
    async (gymId: number, gymData: Partial<Gym>): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => gymService.updateGym(gymId, gymData, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Academia atualizada com sucesso',
          errorMessage: 'Falha ao atualizar academia',
        },
      )
      if (result) {
        await fetchGyms()
        return true
      }
      return false
    },
    [executeWithAuth, fetchGyms],
  )

  const deleteGym = useCallback(
    async (gymId: number): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => gymService.deleteGym(gymId, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Academia deletada com sucesso',
          errorMessage: 'Falha ao deletar academia',
        },
      )
      if (result !== null) {
        await fetchGyms()
        return true
      }
      return false
    },
    [executeWithAuth, fetchGyms],
  )

  const fetchGymStats = useCallback(
    async (gymId: number): Promise<GymStats | null> => {
      const result = await executeWithAuth(
        (token) => gymService.getGymStats(gymId, token),
        {
          showErrorAlert: true,
          errorMessage: 'Falha ao carregar estatísticas',
        },
      )
      if (result) {
        setGymStats(result)
        return result
      }
      return null
    },
    [executeWithAuth],
  )

  return {
    gyms,
    gymStats,
    loading,
    fetchGyms,
    createGym,
    updateGym,
    deleteGym,
    fetchGymStats,
  }
}
