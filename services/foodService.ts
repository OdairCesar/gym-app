import { apiService, ApiResponse } from './apiService'
import { API_ENDPOINTS } from '@/constants/api'
import { Food } from '@/interfaces/Food'

export class FoodService {
  async fetchFoods(
    mealId: number,
    token: string,
  ): Promise<ApiResponse<Food[]>> {
    return apiService.get<Food[]>(API_ENDPOINTS.MEAL_FOODS(mealId), token)
  }

  async fetchFoodById(
    mealId: number,
    foodId: number,
    token: string,
  ): Promise<ApiResponse<Food>> {
    return apiService.get<Food>(
      API_ENDPOINTS.MEAL_FOOD_BY_ID(mealId, foodId),
      token,
    )
  }

  async createFood(
    mealId: number,
    foodData: { name: string },
    token: string,
  ): Promise<ApiResponse<Food>> {
    return apiService.post<Food>(
      API_ENDPOINTS.MEAL_FOODS(mealId),
      foodData,
      token,
    )
  }

  async updateFood(
    mealId: number,
    foodId: number,
    foodData: { name: string },
    token: string,
  ): Promise<ApiResponse<Food>> {
    return apiService.put<Food>(
      API_ENDPOINTS.MEAL_FOOD_BY_ID(mealId, foodId),
      foodData,
      token,
    )
  }

  async deleteFood(
    mealId: number,
    foodId: number,
    token: string,
  ): Promise<ApiResponse<void>> {
    return apiService.delete<void>(
      API_ENDPOINTS.MEAL_FOOD_BY_ID(mealId, foodId),
      token,
    )
  }
}

export const foodService = new FoodService()
