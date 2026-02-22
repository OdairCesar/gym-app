import { apiService, ApiResponse } from './apiService'
import { API_ENDPOINTS } from '@/constants/api'
import { Meal } from '@/interfaces/Meal'

export class MealService {
  async fetchMeals(
    dietId: number,
    token: string,
  ): Promise<ApiResponse<Meal[]>> {
    return apiService.get<Meal[]>(API_ENDPOINTS.DIET_MEALS(dietId), token)
  }

  async fetchMealById(
    dietId: number,
    mealId: number,
    token: string,
  ): Promise<ApiResponse<Meal>> {
    return apiService.get<Meal>(
      API_ENDPOINTS.DIET_MEAL_BY_ID(dietId, mealId),
      token,
    )
  }

  async createMeal(
    dietId: number,
    mealData: Partial<Meal>,
    token: string,
  ): Promise<ApiResponse<Meal>> {
    return apiService.post<Meal>(
      API_ENDPOINTS.DIET_MEALS(dietId),
      mealData,
      token,
    )
  }

  async updateMeal(
    dietId: number,
    mealId: number,
    mealData: Partial<Meal>,
    token: string,
  ): Promise<ApiResponse<Meal>> {
    return apiService.put<Meal>(
      API_ENDPOINTS.DIET_MEAL_BY_ID(dietId, mealId),
      mealData,
      token,
    )
  }

  async deleteMeal(
    dietId: number,
    mealId: number,
    token: string,
  ): Promise<ApiResponse<void>> {
    return apiService.delete<void>(
      API_ENDPOINTS.DIET_MEAL_BY_ID(dietId, mealId),
      token,
    )
  }
}

export const mealService = new MealService()
