import { apiService, ApiResponse } from './apiService'
import { API_ENDPOINTS } from '@/constants/api'
import { User } from '@/interfaces/User'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
  birthDate?: string | null
  phone?: string | null
  cpf?: string | null
  gender?: 'M' | 'F' | 'O' | null
  profession?: string | null
  address?: string | null
  gymId?: number | null
  dietId?: number | null
  isAdmin?: boolean
  isPersonal?: boolean
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export class AuthService {
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return apiService.post<LoginResponse>(API_ENDPOINTS.LOGIN, credentials)
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    return apiService.post<User>(API_ENDPOINTS.REGISTER, userData)
  }

  async logout(token: string): Promise<ApiResponse<void>> {
    return apiService.post<void>(API_ENDPOINTS.LOGOUT, {}, token)
  }

  async getCurrentUser(token: string): Promise<ApiResponse<User>> {
    return apiService.get<User>(API_ENDPOINTS.AUTH_ME, token)
  }
}

export const authService = new AuthService()
