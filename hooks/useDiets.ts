import { useState, useCallback } from 'react'
import { Diet } from '@/interfaces/Diet'
import { dietService } from '@/services/dietService'
import { useApi } from './useApi'
import { ENV } from '@/constants/environment'
import { extractList } from '@/utils/apiUtils'

interface UseDietsReturn {
  diets: Diet[]
  loading: boolean
  fetchDiets: () => Promise<void>
  fetchDietById: (dietId: number) => Promise<Diet | null>
  fetchUserDiet: (userId: number) => Promise<Diet | null>
  fetchDietsFiltered: (params: { userId?: number; creatorId?: number; name?: string }) => Promise<void>
  createDiet: (dietData: Partial<Diet>) => Promise<boolean>
  updateDiet: (dietId: number, dietData: Partial<Diet>) => Promise<boolean>
  deleteDiet: (dietId: number) => Promise<boolean>
  refreshDiets: () => Promise<void>
  getDietById: (dietId: number) => Diet | undefined
  filterDiets: (filters: { name?: string; calories?: string }) => Diet[]
}

export const useDiets = (): UseDietsReturn => {
  const { executeWithAuth } = useApi()
  const [diets, setDiets] = useState<Diet[]>([])
  const [loading, setLoading] = useState(false)

  const fetchDiets = useCallback(async () => {
    try {
      setLoading(true)
      const result = await executeWithAuth(
        (token) => dietService.fetchDiets(token),
        { showErrorAlert: true, errorMessage: 'Falha ao carregar dietas' },
      )
      if (result) setDiets(extractList<Diet>(result))
    } catch (error) {
      console.error('Erro ao carregar dietas:', error)
    } finally {
      setLoading(false)
    }
  }, [executeWithAuth])

  const fetchDietById = useCallback(
    async (dietId: number): Promise<Diet | null> => {
      try {
        const result = await executeWithAuth(
          (token) => dietService.fetchDietById(dietId, token),
          { showErrorAlert: true, errorMessage: 'Falha ao carregar dieta' },
        )
        return result || null
      } catch (error) {
        console.error('Erro ao carregar dieta:', error)
        return null
      }
    },
    [executeWithAuth],
  )

  /**
   * Busca a primeira dieta da lista (GET /diets já filtra pelo usuário autenticado).
   * Fallback usado quando o User não tem dietId preenchido no AsyncStorage.
   * Retorna o id encontrado para que a tela possa buscar o detalhe completo.
   */
  const fetchUserDiet = useCallback(
    async (userId: number): Promise<Diet | null> => {
      try {
        const result = await executeWithAuth(
          (token) => dietService.fetchDiets(token),
          { showErrorAlert: false },
        )
        if (result) {
          const list = extractList<Diet>(result)
          // A API filtra por usuário autenticado, usa o primeiro da lista
          const found = list.find((d) => d.userId === userId) ?? list[0] ?? null
          if (found) return await fetchDietById(found.id)
        }
        return null
      } catch (error) {
        console.error('Erro ao buscar dieta do usuário:', error)
        return null
      }
    },
    [executeWithAuth, fetchDietById],
  )

  const createDiet = useCallback(
    async (dietData: Partial<Diet>): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => dietService.createDiet(dietData, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Dieta criada com sucesso',
          errorMessage: 'Falha ao criar dieta',
        },
      )
      if (result) { await fetchDiets(); return true }
      return false
    },
    [executeWithAuth, fetchDiets],
  )

  const updateDiet = useCallback(
    async (dietId: number, dietData: Partial<Diet>): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => dietService.updateDiet(dietId, dietData, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Dieta atualizada com sucesso',
          errorMessage: 'Falha ao atualizar dieta',
        },
      )
      if (result) { await fetchDiets(); return true }
      return false
    },
    [executeWithAuth, fetchDiets],
  )

  const deleteDiet = useCallback(
    async (dietId: number): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => dietService.deleteDiet(dietId, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Dieta deletada com sucesso',
          errorMessage: 'Falha ao deletar dieta',
        },
      )
      if (result !== null) { await fetchDiets(); return true }
      return false
    },
    [executeWithAuth, fetchDiets],
  )

  const fetchDietsFiltered = useCallback(
    async (params: { userId?: number; creatorId?: number; name?: string }) => {
      try {
        setLoading(true)
        const result = await executeWithAuth(
          (token) => dietService.fetchDietsFiltered(params, token),
          { showErrorAlert: true, errorMessage: 'Falha ao filtrar dietas' },
        )
        if (result) setDiets(extractList<Diet>(result))
      } catch (error) {
        console.error('Erro ao filtrar dietas:', error)
      } finally {
        setLoading(false)
      }
    },
    [executeWithAuth],
  )

  const refreshDiets = useCallback(async () => { await fetchDiets() }, [fetchDiets])

  const getDietById = useCallback(
    (dietId: number): Diet | undefined => dietService.getDietById(diets, dietId),
    [diets],
  )

  const filterDiets = useCallback(
    (filters: { name?: string; calories?: string }): Diet[] =>
      dietService.filterDiets(diets, filters),
    [diets],
  )

  return { diets, loading, fetchDiets, fetchDietById, fetchUserDiet, fetchDietsFiltered, createDiet, updateDiet, deleteDiet, refreshDiets, getDietById, filterDiets }
}
