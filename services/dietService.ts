import { apiService, ApiResponse } from './apiService'
import { API_ENDPOINTS } from '@/constants/api'
import { Diet } from '@/interfaces/Diet'

export class DietService {
  async fetchDiets(token: string): Promise<ApiResponse<Diet[]>> {
    return apiService.get<Diet[]>(API_ENDPOINTS.DIETS, token)
  }

  async fetchDietsFiltered(
    params: { userId?: number; creatorId?: number; name?: string },
    token: string,
  ): Promise<ApiResponse<Diet[]>> {
    const qs = new URLSearchParams()
    if (params.userId) qs.append('user_id', String(params.userId))
    if (params.creatorId) qs.append('creator_id', String(params.creatorId))
    if (params.name) qs.append('name', params.name)
    const query = qs.toString()
    const url = query ? `${API_ENDPOINTS.DIETS}?${query}` : API_ENDPOINTS.DIETS
    return apiService.get<Diet[]>(url, token)
  }

  async fetchDietById(
    dietId: number,
    token: string,
  ): Promise<ApiResponse<Diet>> {
    return apiService.get<Diet>(API_ENDPOINTS.DIET_BY_ID(dietId), token)
  }

  async createDiet(
    dietData: Partial<Diet>,
    token: string,
  ): Promise<ApiResponse<Diet>> {
    return apiService.post<Diet>(API_ENDPOINTS.DIETS, dietData, token)
  }

  async updateDiet(
    dietId: number,
    dietData: Partial<Diet>,
    token: string,
  ): Promise<ApiResponse<Diet>> {
    return apiService.put<Diet>(
      API_ENDPOINTS.DIET_BY_ID(dietId),
      dietData,
      token,
    )
  }

  async deleteDiet(dietId: number, token: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(API_ENDPOINTS.DIET_BY_ID(dietId), token)
  }

  // Funções utilitárias para filtros e manipulação
  filterDiets(
    diets: Diet[],
    filters: {
      name?: string
      calories?: string
    },
  ): Diet[] {
    let filtered = [...diets]

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((diet) => {
          if (key === 'calories') {
            const numValue = parseFloat(value)
            if (isNaN(numValue)) return true
            return (diet.calories || 0) >= numValue
          } else {
            const dietValue = diet[key as keyof Diet]
            return dietValue
              ?.toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          }
        })
      }
    })

    return filtered
  }

  getDietById(diets: Diet[], dietId: number): Diet | undefined {
    return diets.find((diet) => diet.id === dietId)
  }

  calculateTotalCalories(diet: Diet): number {
    return diet.calories || 0
  }

  calculateTotalMacros(diet: Diet) {
    return {
      proteins: diet.proteins || 0,
      carbohydrates: diet.carbohydrates || 0,
      fats: diet.fats || 0,
    }
  }

  searchDiets(diets: Diet[], searchTerm: string): Diet[] {
    if (!searchTerm) return diets

    const term = searchTerm.toLowerCase()
    return diets.filter(
      (diet) =>
        diet.name.toLowerCase().includes(term) ||
        diet.description?.toLowerCase().includes(term),
    )
  }
}

export const dietService = new DietService()

