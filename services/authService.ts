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
  nome: string
  email: string
  password: string
  dataNascimento?: Date
  telefone?: string
  cpf?: string
  sexo?: 'M' | 'F' | 'O'
  profissao?: string
  endereco?: string
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

  async changePassword(
    passwordData: ChangePasswordRequest,
    token: string,
  ): Promise<ApiResponse<void>> {
    return apiService.post<void>(
      API_ENDPOINTS.CHANGE_PASSWORD,
      passwordData,
      token,
    )
  }

  async getCurrentUser(token: string): Promise<ApiResponse<User>> {
    return apiService.get<User>(API_ENDPOINTS.USER_ME, token)
  }

  async updateCurrentUser(
    userData: Partial<User>,
    token: string,
  ): Promise<ApiResponse<User>> {
    return apiService.put<User>(API_ENDPOINTS.USER_ME, userData, token)
  }
}

export const authService = new AuthService()
