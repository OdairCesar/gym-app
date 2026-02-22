import { useCallback } from 'react'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useApi } from './useApi'
import {
  authService,
  LoginRequest,
  RegisterRequest,
} from '@/services/authService'
import { userService } from '@/services/userService'
import { User } from '@/interfaces/User'
import { ENV } from '@/constants/environment'

export const useAuth = () => {
  const router = useRouter()
  const { executeWithoutAuth, executeWithAuth } = useApi()

  const login = useCallback(
    async (credentials: LoginRequest): Promise<boolean> => {
      const result = await executeWithoutAuth(
        () => authService.login(credentials),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Login realizado com sucesso',
          errorMessage: 'Credenciais inválidas',
        },
      )

      if (result) {
        await AsyncStorage.setItem('userToken', result.token)
        await AsyncStorage.setItem('userData', JSON.stringify(result.user))

        // A API retorna `role` (snake_case). Suportamos ambos os formatos.
        const rawUser = result.user as unknown as Record<string, unknown>
        const role = String(rawUser.role ?? '')
        const isAdmin =
          role === 'admin' || role === 'super' || !!rawUser.isAdmin
        const isPersonal = role === 'personal' || !!rawUser.isPersonal

        if (isAdmin) {
          router.replace('/(admin)/users')
        } else if (isPersonal) {
          router.replace('/(personal)/trainings')
        } else {
          router.replace('/(client)/training')
        }

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
          showSuccessAlert: ENV.showSuccessAlerts,
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

  const logout = useCallback(async (): Promise<void> => {
    await executeWithAuth((token) => authService.logout(token), {
      showSuccessAlert: false,
      showErrorAlert: false,
    }).catch(() => {})
    await AsyncStorage.removeItem('userToken')
    await AsyncStorage.removeItem('userData')
    router.replace('/(auth)/login')
  }, [executeWithAuth, router])

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) =>
          userService.changePassword(currentPassword, newPassword, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Senha alterada com sucesso',
          errorMessage: 'Erro ao alterar senha',
        },
      )

      return result !== null
    },
    [executeWithAuth],
  )

  const updateProfile = useCallback(
    async (userId: number, userData: Partial<User>): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => userService.updateUser(userId, userData, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
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
      // GET /auth/me pode retornar { user: {...} } como wrapper
      const userData =
        (result as unknown as Record<string, unknown>).user ?? result
      const baseUser = userData as User

      // Busca dados completos via /users/:id para obter gym embutido
      const fullUser = await executeWithAuth(
        (token) => userService.fetchUserById(baseUser.id, token),
        { showErrorAlert: false },
      )

      const enrichedUser: User = fullUser
        ? { ...baseUser, gym: (fullUser as User).gym }
        : baseUser

      await AsyncStorage.setItem('userData', JSON.stringify(enrichedUser))
      return enrichedUser
    }

    return null
  }, [executeWithAuth])

  return {
    login,
    register,
    logout,
    changePassword,
    updateProfile,
    fetchCurrentUser,
  }
}
