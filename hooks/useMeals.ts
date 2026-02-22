import { useState, useCallback } from 'react'
import { Meal } from '@/interfaces/Meal'
import { mealService } from '@/services/mealService'
import { useApi } from './useApi'
import { ENV } from '@/constants/environment'
import { extractList } from '@/utils/apiUtils'

interface UseMealsReturn {
  meals: Meal[]
  loading: boolean
  fetchMeals: (dietId: number) => Promise<void>
  createMeal: (dietId: number, mealData: Partial<Meal>) => Promise<boolean>
  updateMeal: (
    dietId: number,
    mealId: number,
    mealData: Partial<Meal>,
  ) => Promise<boolean>
  deleteMeal: (dietId: number, mealId: number) => Promise<boolean>
  refreshMeals: (dietId: number) => Promise<void>
}

export const useMeals = (): UseMealsReturn => {
  const { executeWithAuth } = useApi()
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(false)

  const fetchMeals = useCallback(
    async (dietId: number) => {
      try {
        setLoading(true)
        const result = await executeWithAuth(
          (token) => mealService.fetchMeals(dietId, token),
          {
            showErrorAlert: true,
            errorMessage: 'Falha ao carregar refeições',
          },
        )
        if (result) setMeals(extractList<Meal>(result))
      } catch (error) {
        console.error('Erro ao carregar refeições:', error)
      } finally {
        setLoading(false)
      }
    },
    [executeWithAuth],
  )

  const createMeal = useCallback(
    async (dietId: number, mealData: Partial<Meal>): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => mealService.createMeal(dietId, mealData, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Refeição criada com sucesso',
          errorMessage: 'Falha ao criar refeição',
        },
      )
      if (result) {
        await fetchMeals(dietId)
        return true
      }
      return false
    },
    [executeWithAuth, fetchMeals],
  )

  const updateMeal = useCallback(
    async (
      dietId: number,
      mealId: number,
      mealData: Partial<Meal>,
    ): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => mealService.updateMeal(dietId, mealId, mealData, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Refeição atualizada com sucesso',
          errorMessage: 'Falha ao atualizar refeição',
        },
      )
      if (result) {
        await fetchMeals(dietId)
        return true
      }
      return false
    },
    [executeWithAuth, fetchMeals],
  )

  const deleteMeal = useCallback(
    async (dietId: number, mealId: number): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => mealService.deleteMeal(dietId, mealId, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Refeição deletada com sucesso',
          errorMessage: 'Falha ao deletar refeição',
        },
      )
      if (result !== null) {
        await fetchMeals(dietId)
        return true
      }
      return false
    },
    [executeWithAuth, fetchMeals],
  )

  const refreshMeals = useCallback(
    async (dietId: number) => {
      await fetchMeals(dietId)
    },
    [fetchMeals],
  )

  return {
    meals,
    loading,
    fetchMeals,
    createMeal,
    updateMeal,
    deleteMeal,
    refreshMeals,
  }
}
