import { useState, useCallback } from 'react'
import { Food } from '@/interfaces/Food'
import { foodService } from '@/services/foodService'
import { useApi } from './useApi'
import { ENV } from '@/constants/environment'
import { extractList } from '@/utils/apiUtils'

interface UseFoodsReturn {
  foods: Food[]
  loading: boolean
  fetchFoods: (mealId: number) => Promise<void>
  createFood: (mealId: number, foodData: { name: string }) => Promise<boolean>
  updateFood: (
    mealId: number,
    foodId: number,
    foodData: { name: string },
  ) => Promise<boolean>
  deleteFood: (mealId: number, foodId: number) => Promise<boolean>
  refreshFoods: (mealId: number) => Promise<void>
}

export const useFoods = (): UseFoodsReturn => {
  const { executeWithAuth } = useApi()
  const [foods, setFoods] = useState<Food[]>([])
  const [loading, setLoading] = useState(false)

  const fetchFoods = useCallback(
    async (mealId: number) => {
      try {
        setLoading(true)
        const result = await executeWithAuth(
          (token) => foodService.fetchFoods(mealId, token),
          {
            showErrorAlert: true,
            errorMessage: 'Falha ao carregar alimentos',
          },
        )
        if (result) setFoods(extractList<Food>(result))
      } catch (error) {
        console.error('Erro ao carregar alimentos:', error)
      } finally {
        setLoading(false)
      }
    },
    [executeWithAuth],
  )

  const createFood = useCallback(
    async (mealId: number, foodData: { name: string }): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => foodService.createFood(mealId, foodData, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Alimento criado com sucesso',
          errorMessage: 'Falha ao criar alimento',
        },
      )
      if (result) {
        await fetchFoods(mealId)
        return true
      }
      return false
    },
    [executeWithAuth, fetchFoods],
  )

  const updateFood = useCallback(
    async (
      mealId: number,
      foodId: number,
      foodData: { name: string },
    ): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => foodService.updateFood(mealId, foodId, foodData, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Alimento atualizado com sucesso',
          errorMessage: 'Falha ao atualizar alimento',
        },
      )
      if (result) {
        await fetchFoods(mealId)
        return true
      }
      return false
    },
    [executeWithAuth, fetchFoods],
  )

  const deleteFood = useCallback(
    async (mealId: number, foodId: number): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => foodService.deleteFood(mealId, foodId, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Alimento deletado com sucesso',
          errorMessage: 'Falha ao deletar alimento',
        },
      )
      if (result !== null) {
        await fetchFoods(mealId)
        return true
      }
      return false
    },
    [executeWithAuth, fetchFoods],
  )

  const refreshFoods = useCallback(
    async (mealId: number) => {
      await fetchFoods(mealId)
    },
    [fetchFoods],
  )

  return {
    foods,
    loading,
    fetchFoods,
    createFood,
    updateFood,
    deleteFood,
    refreshFoods,
  }
}
