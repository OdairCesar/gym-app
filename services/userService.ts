import { apiService, ApiResponse } from './apiService'
import { API_ENDPOINTS } from '@/constants/api'
import { User } from '@/interfaces/User'

export class UserService {
  async fetchUsers(token: string): Promise<ApiResponse<User[]>> {
    return apiService.get<User[]>(API_ENDPOINTS.USERS, token)
  }

  async fetchUserById(
    userId: number,
    token: string,
  ): Promise<ApiResponse<User>> {
    return apiService.get<User>(API_ENDPOINTS.USER_BY_ID(userId), token)
  }

  async createUser(
    userData: Partial<User>,
    token: string,
  ): Promise<ApiResponse<User>> {
    return apiService.post<User>(API_ENDPOINTS.USERS, userData, token)
  }

  async updateUser(
    userId: number,
    userData: Partial<User>,
    token: string,
  ): Promise<ApiResponse<User>> {
    return apiService.put<User>(
      API_ENDPOINTS.USER_BY_ID(userId),
      userData,
      token,
    )
  }

  async deleteUser(userId: number, token: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(API_ENDPOINTS.USER_BY_ID(userId), token)
  }

  async fetchPendingUsers(token: string): Promise<ApiResponse<User[]>> {
    return apiService.get<User[]>(API_ENDPOINTS.PENDING_USERS, token)
  }

  async approveUser(userId: number, token: string): Promise<ApiResponse<void>> {
    return apiService.post<void>(API_ENDPOINTS.APPROVE_USER(userId), {}, token)
  }

  async rejectUser(userId: number, token: string): Promise<ApiResponse<void>> {
    return apiService.post<void>(API_ENDPOINTS.REJECT_USER(userId), {}, token)
  }

  async assignDietToUser(
    userId: number,
    dietId: number,
    token: string,
  ): Promise<ApiResponse<void>> {
    return apiService.put<void>(
      API_ENDPOINTS.USER_BY_ID(userId),
      { dietId },
      token,
    )
  }

  async assignTrainingToUser(
    userId: number,
    trainingId: number,
    token: string,
  ): Promise<ApiResponse<void>> {
    return apiService.put<void>(
      API_ENDPOINTS.USER_BY_ID(userId),
      { trainingId },
      token,
    )
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
    token: string,
  ): Promise<ApiResponse<void>> {
    return apiService.post<void>(
      '/auth/change-password',
      {
        currentPassword,
        newPassword,
      },
      token,
    )
  }

  // Funções utilitárias
  getPersonals(users: User[]): User[] {
    return users.filter((user) => user.role === 'personal')
  }

  getClients(users: User[]): User[] {
    return users.filter((user) => user.role === 'user')
  }

  getAdmins(users: User[]): User[] {
    return users.filter(
      (user) => user.role === 'admin' || user.role === 'super',
    )
  }

  getUserById(users: User[], userId: number): User | undefined {
    return users.find((user) => user.id === userId)
  }

  searchUsers(users: User[], searchTerm: string): User[] {
    if (!searchTerm) return users

    const term = searchTerm.toLowerCase()
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term),
    )
  }

  getActiveUsers(users: User[]): User[] {
    return users.filter((user) => Boolean(user.approved))
  }
}

export const userService = new UserService()
