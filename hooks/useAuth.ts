import { useCallback } from 'react'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useApi } from './useApi'
import {
  authService,
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
} from '@/services/authService'
import { User } from '@/interfaces/User'

export const useAuth = () => {
  const router = useRouter()
  const { executeWithoutAuth, executeWithAuth } = useApi()

  const login = useCallback(
    async (credentials: LoginRequest): Promise<boolean> => {
      const result = await executeWithoutAuth(
        () => authService.login(credentials),
        {
          showSuccessAlert: true,
          successMessage: 'Login realizado com sucesso',
          errorMessage: 'Credenciais inválidas',
        },
      )

      if (result) {
        await AsyncStorage.setItem('userToken', result.token)
        await AsyncStorage.setItem('userData', JSON.stringify(result.user))
        router.replace('/(client)/perfil')
        return true
      }

      return false
    },
    [executeWithoutAuth, router],
  )

  const register = useCallback(
    async (userData: RegisterRequest): Promise<boolean> => {
      const result = await executeWithoutAuth(
        () => authService.register(userData),
        {
          showSuccessAlert: true,
          successMessage: 'Usuário registrado com sucesso',
          errorMessage: 'Erro ao registrar usuário',
        },
      )

      if (result) {
        router.replace('/(auth)/login')
        return true
      }

      return false
    },
    [executeWithoutAuth, router],
  )

  const changePassword = useCallback(
    async (passwordData: ChangePasswordRequest): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => authService.changePassword(passwordData, token),
        {
          showSuccessAlert: true,
          successMessage: 'Senha alterada com sucesso',
          errorMessage: 'Erro ao alterar senha',
        },
      )

      return result !== null
    },
    [executeWithAuth],
  )

  const updateProfile = useCallback(
    async (userData: Partial<User>): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => authService.updateCurrentUser(userData, token),
        {
          showSuccessAlert: true,
          successMessage: 'Perfil atualizado com sucesso',
          errorMessage: 'Erro ao atualizar perfil',
        },
      )

      if (result) {
        // Atualizar dados locais
        await AsyncStorage.setItem('userData', JSON.stringify(result))
        return true
      }

      return false
    },
    [executeWithAuth],
  )

  const fetchCurrentUser = useCallback(async (): Promise<User | null> => {
    const result = await executeWithAuth(
      (token) => authService.getCurrentUser(token),
      {
        showErrorAlert: true,
        errorMessage: 'Erro ao buscar dados do usuário',
      },
    )

    if (result) {
      // Atualizar dados locais
      await AsyncStorage.setItem('userData', JSON.stringify(result))
      return result
    }

    return null
  }, [executeWithAuth])

  return {
    login,
    register,
    changePassword,
    updateProfile,
    fetchCurrentUser,
  }
}
