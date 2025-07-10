import { apiService, ApiResponse } from './apiService'
import { API_ENDPOINTS } from '@/constants/api'
import { User } from '@/interfaces/User'

export class UserService {
  async fetchUsers(token: string): Promise<ApiResponse<User[]>> {
    return apiService.get<User[]>(API_ENDPOINTS.USER, token)
  }

  async fetchCurrentUser(token: string): Promise<ApiResponse<User>> {
    return apiService.get<User>(API_ENDPOINTS.USER_ME, token)
  }

  async updateUser(
    userId: string,
    userData: Partial<User>,
    token: string,
  ): Promise<ApiResponse<User>> {
    return apiService.put<User>(
      `${API_ENDPOINTS.USER}/${userId}`,
      userData,
      token,
    )
  }

  async createUser(
    userData: Partial<User>,
    token: string,
  ): Promise<ApiResponse<User>> {
    return apiService.post<User>(API_ENDPOINTS.USER, userData, token)
  }

  async deleteUser(userId: string, token: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`${API_ENDPOINTS.USER}/${userId}`, token)
  }

  async assignDietToUser(
    userId: string,
    dietId: string,
    token: string,
  ): Promise<ApiResponse<void>> {
    return apiService.put<void>(
      `${API_ENDPOINTS.USER}/${userId}`,
      { diet_id: dietId },
      token,
    )
  }

  async assignTrainingToUser(
    userId: string,
    trainingId: string,
    token: string,
  ): Promise<ApiResponse<void>> {
    return apiService.put<void>(
      `${API_ENDPOINTS.USER}/${userId}`,
      { training_id: trainingId },
      token,
    )
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
    token: string,
  ): Promise<ApiResponse<void>> {
    return apiService.post<void>(
      API_ENDPOINTS.CHANGE_PASSWORD,
      {
        currentPassword,
        newPassword,
      },
      token,
    )
  }

  // Funções utilitárias
  getPersonals(users: User[]): User[] {
    return users.filter((user) => user.isPersonal === true)
  }

  getClients(users: User[]): User[] {
    return users.filter((user) => !user.isAdmin && !user.isPersonal)
  }

  getAdmins(users: User[]): User[] {
    return users.filter((user) => user.isAdmin === true)
  }

  getUserById(users: User[], userId: string): User | undefined {
    return users.find((user) => user._id === userId)
  }

  searchUsers(users: User[], searchTerm: string): User[] {
    if (!searchTerm) return users

    const term = searchTerm.toLowerCase()
    return users.filter(
      (user) =>
        user.nome.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term),
    )
  }

  getActiveUsers(users: User[]): User[] {
    return users.filter((user) => user.isActive !== false)
  }
}

export const userService = new UserService()
