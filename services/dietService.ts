import { apiService, ApiResponse } from './apiService'
import { API_ENDPOINTS } from '@/constants/api'
import { IDiet } from '@/interfaces/Diet'

export class DietService {
  async fetchDiets(token: string): Promise<ApiResponse<IDiet[]>> {
    return apiService.get<IDiet[]>(API_ENDPOINTS.DIET, token)
  }

  async fetchUserDiet(token: string): Promise<ApiResponse<IDiet>> {
    return apiService.get<IDiet>(API_ENDPOINTS.DIET_ME, token)
  }

  async createDiet(
    dietData: Partial<IDiet>,
    token: string,
  ): Promise<ApiResponse<IDiet>> {
    return apiService.post<IDiet>(API_ENDPOINTS.DIET, dietData, token)
  }

  async updateDiet(
    dietId: string,
    dietData: Partial<IDiet>,
    token: string,
  ): Promise<ApiResponse<IDiet>> {
    return apiService.put<IDiet>(
      `${API_ENDPOINTS.DIET}/${dietId}`,
      dietData,
      token,
    )
  }

  async deleteDiet(dietId: string, token: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`${API_ENDPOINTS.DIET}/${dietId}`, token)
  }

  async getDietByIdFromApi(
    dietId: string,
    token: string,
  ): Promise<ApiResponse<IDiet>> {
    return apiService.get<IDiet>(`${API_ENDPOINTS.DIET}/${dietId}`, token)
  }

  // Funções utilitárias para filtros e manipulação
  filterDiets(
    diets: IDiet[],
    filters: {
      nome?: string
      criador?: string
      calorias?: string
    },
  ): IDiet[] {
    let filtered = [...diets]

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((diet) => {
          if (key === 'criador') {
            return diet.criador === value
          } else if (key === 'calorias') {
            const numValue = parseFloat(value)
            if (isNaN(numValue)) return true
            return (diet.calorias || 0) >= numValue
          } else {
            const dietValue = diet[key as keyof IDiet]
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

  getDietById(diets: IDiet[], dietId: string): IDiet | undefined {
    return diets.find((diet) => diet._id === dietId)
  }

  getDietsByCreator(diets: IDiet[], creatorId: string): IDiet[] {
    return diets.filter((diet) => diet.criador === creatorId)
  }

  calculateTotalCalories(diet: IDiet): number {
    return diet.calorias || 0
  }

  calculateTotalMacros(diet: IDiet) {
    return {
      proteinas: diet.proteinas || 0,
      carboidratos: diet.carboidratos || 0,
      gorduras: diet.gorduras || 0,
    }
  }

  getMealsCount(diet: IDiet): number {
    return diet.refeicoes?.length || 0
  }

  searchDiets(diets: IDiet[], searchTerm: string): IDiet[] {
    if (!searchTerm) return diets

    const term = searchTerm.toLowerCase()
    return diets.filter(
      (diet) =>
        diet.nome.toLowerCase().includes(term) ||
        diet.descricao?.toLowerCase().includes(term),
    )
  }
}

export const dietService = new DietService()
