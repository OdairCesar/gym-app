import { useState, useCallback } from 'react'
import { Alert } from 'react-native'
import { useAuth } from '@/context/authContext'
import { ApiResponse } from '@/services/apiService'

interface UseApiOptions {
  showSuccessAlert?: boolean
  showErrorAlert?: boolean
  successMessage?: string
  errorMessage?: string
}

interface UseApiReturn {
  loading: boolean
  error: string | null
  executeWithAuth: <T>(
    operation: (token: string) => Promise<ApiResponse<T>>,
    options?: UseApiOptions,
  ) => Promise<T | null>
  executeWithoutAuth: <T>(
    operation: () => Promise<ApiResponse<T>>,
    options?: UseApiOptions,
  ) => Promise<T | null>
  setLoading: (loading: boolean) => void
  clearError: () => void
}

export const useApi = (): UseApiReturn => {
  const { getToken, logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleErrorResponse = useCallback(
    async (response: ApiResponse<unknown>, fallbackMessage: string) => {
      const { statusCode, message, validationErrors } = response

      if (statusCode === 401) {
        await logout()
        const msg = 'Sessão expirada. Faça login novamente'
        setError(msg)
        Alert.alert('Sessão Expirada', msg)
        return
      }

      if (statusCode === 403) {
        const msg = 'Sem permissão para realizar esta ação'
        setError(msg)
        Alert.alert('Acesso Negado', msg)
        return
      }

      if (statusCode === 422 && validationErrors && validationErrors.length > 0) {
        const msgs = validationErrors.map((e) => `• ${e.message}`).join('\n')
        setError(msgs)
        Alert.alert('Dados Inválidos', msgs)
        return
      }

      if (statusCode === 0) {
        const msg = 'Sem conexão com a internet. Verifique sua rede'
        setError(msg)
        Alert.alert('Sem Conexão', msg)
        return
      }

      const errorMsg = message || fallbackMessage
      setError(errorMsg)
      Alert.alert('Erro', errorMsg)
    },
    [logout],
  )

  const executeWithAuth = useCallback(
    async <T>(
      operation: (token: string) => Promise<ApiResponse<T>>,
      options: UseApiOptions = {},
    ): Promise<T | null> => {
      const {
        showSuccessAlert = false,
        showErrorAlert = true,
        successMessage = 'Operação realizada com sucesso',
        errorMessage = 'Erro ao executar operação',
      } = options

      try {
        setLoading(true)
        setError(null)

        const token = await getToken()

        if (!token) {
          const authError = 'Token de autenticação não encontrado'
          setError(authError)
          if (showErrorAlert) {
            Alert.alert('Erro', authError)
          }
          return null
        }

        const response = await operation(token)

        if (response.status === 'success' && response.data) {
          if (showSuccessAlert) {
            Alert.alert('Sucesso', successMessage)
          }
          return response.data
        } else {
          if (showErrorAlert) {
            await handleErrorResponse(
              response as ApiResponse<unknown>,
              errorMessage,
            )
          } else {
            setError(response.message || errorMessage)
          }
          return null
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : 'Erro de conexão'
        setError(errorMsg)
        if (showErrorAlert) {
          Alert.alert('Erro', errorMsg)
        }
        return null
      } finally {
        setLoading(false)
      }
    },
    [getToken, handleErrorResponse],
  )

  const executeWithoutAuth = useCallback(
    async <T>(
      operation: () => Promise<ApiResponse<T>>,
      options: UseApiOptions = {},
    ): Promise<T | null> => {
      const {
        showSuccessAlert = false,
        showErrorAlert = true,
        successMessage = 'Operação realizada com sucesso',
        errorMessage = 'Erro ao executar operação',
      } = options

      try {
        setLoading(true)
        setError(null)

        const response = await operation()

        if (response.status === 'success' && response.data) {
          if (showSuccessAlert) {
            Alert.alert('Sucesso', successMessage)
          }
          return response.data
        } else {
          if (showErrorAlert) {
            await handleErrorResponse(
              response as ApiResponse<unknown>,
              errorMessage,
            )
          } else {
            setError(response.message || errorMessage)
          }
          return null
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : 'Erro de conexão'
        setError(errorMsg)
        if (showErrorAlert) {
          Alert.alert('Erro', errorMsg)
        }
        return null
      } finally {
        setLoading(false)
      }
    },
    [handleErrorResponse],
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    loading,
    error,
    executeWithAuth,
    executeWithoutAuth,
    setLoading,
    clearError,
  }
}
