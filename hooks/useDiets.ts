import { useState, useCallback } from 'react'
import { IDiet } from '@/interfaces/Diet'
import { dietService } from '@/services/dietService'
import { useApi } from './useApi'
import { ENV } from '@/constants/environment'

interface UseDietsReturn {
  // Estados
  diets: IDiet[]
  loading: boolean

  // Funções
  fetchDiets: () => Promise<void>
  fetchUserDiet: () => Promise<IDiet | null>
  createDiet: (dietData: Partial<IDiet>) => Promise<boolean>
  updateDiet: (dietId: string, dietData: Partial<IDiet>) => Promise<boolean>
  deleteDiet: (dietId: string) => Promise<boolean>
  refreshDiets: () => Promise<void>

  // Utilitários
  getDietById: (dietId: string) => IDiet | undefined
  getDietsByCreator: (creatorId: string) => IDiet[]
  filterDiets: (filters: {
    nome?: string
    criador?: string
    calorias?: string
  }) => IDiet[]
}

export const useDiets = (): UseDietsReturn => {
  const { executeWithAuth } = useApi()

  const [diets, setDiets] = useState<IDiet[]>([])
  const [loading, setLoading] = useState(false)

  const fetchDiets = useCallback(async () => {
    try {
      setLoading(true)
      const result = await executeWithAuth(
        (token) => dietService.fetchDiets(token),
        {
          showErrorAlert: true,
          errorMessage: 'Falha ao carregar dietas',
        },
      )

      if (result) {
        setDiets(result)
      }
    } catch (error) {
      console.error('Erro ao carregar dietas:', error)
    } finally {
      setLoading(false)
    }
  }, [executeWithAuth])

  const fetchUserDiet = useCallback(async (): Promise<IDiet | null> => {
    try {
      setLoading(true)
      const result = await executeWithAuth(
        (token) => dietService.fetchUserDiet(token),
        {
          showErrorAlert: true,
          errorMessage: 'Falha ao carregar dieta do usuário',
        },
      )

      return result || null
    } catch (error) {
      console.error('Erro ao carregar dieta do usuário:', error)
      return null
    } finally {
      setLoading(false)
    }
  }, [executeWithAuth])

  const createDiet = useCallback(
    async (dietData: Partial<IDiet>): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => dietService.createDiet(dietData, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Dieta criada com sucesso',
          errorMessage: 'Falha ao criar dieta',
        },
      )

      if (result) {
        await fetchDiets()
        return true
      }

      return false
    },
    [executeWithAuth, fetchDiets],
  )

  const updateDiet = useCallback(
    async (dietId: string, dietData: Partial<IDiet>): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => dietService.updateDiet(dietId, dietData, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Dieta atualizada com sucesso',
          errorMessage: 'Falha ao atualizar dieta',
        },
      )

      if (result) {
        await fetchDiets()
        return true
      }

      return false
    },
    [executeWithAuth, fetchDiets],
  )

  const deleteDiet = useCallback(
    async (dietId: string): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => dietService.deleteDiet(dietId, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Dieta deletada com sucesso',
          errorMessage: 'Falha ao deletar dieta',
        },
      )

      if (result) {
        await fetchDiets()
        return true
      }

      return false
    },
    [executeWithAuth, fetchDiets],
  )

  const refreshDiets = useCallback(async () => {
    await fetchDiets()
  }, [fetchDiets])

  // Funções utilitárias
  const getDietById = useCallback(
    (dietId: string): IDiet | undefined => {
      return dietService.getDietById(diets, dietId)
    },
    [diets],
  )

  const getDietsByCreator = useCallback(
    (creatorId: string): IDiet[] => {
      return dietService.getDietsByCreator(diets, creatorId)
    },
    [diets],
  )

  const filterDiets = useCallback(
    (filters: {
      nome?: string
      criador?: string
      calorias?: string
    }): IDiet[] => {
      return dietService.filterDiets(diets, filters)
    },
    [diets],
  )

  return {
    // Estados
    diets,
    loading,

    // Funções
    fetchDiets,
    fetchUserDiet,
    createDiet,
    updateDiet,
    deleteDiet,
    refreshDiets,

    // Utilitários
    getDietById,
    getDietsByCreator,
    filterDiets,
  }
}
