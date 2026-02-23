import { useState, useCallback } from 'react'
import { useAuth } from '@/context/authContext'
import { ApiResponse } from '@/services/apiService'
import { toast } from '@/utils/toast'

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
        toast.error('Sessão Expirada', msg)
        return
      }

      if (statusCode === 403) {
        const msg = 'Sem permissão para realizar esta ação'
        setError(msg)
        toast.error('Acesso Negado', msg)
        return
      }

      if (statusCode === 422 && validationErrors && validationErrors.length > 0) {
        const msgs = validationErrors.map((e) => `• ${e.message}`).join('\n')
        setError(msgs)
        toast.error('Dados Inválidos', msgs)
        return
      }

      if (statusCode === 0) {
        const msg = 'Sem conexão com a internet. Verifique sua rede'
        setError(msg)
        toast.error('Sem Conexão', msg)
        return
      }

      const errorMsg = message || fallbackMessage
      setError(errorMsg)
      toast.error('Erro', errorMsg)
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
            toast.error('Erro', authError)
          }
          return null
        }

        const response = await operation(token)

        if (response.status === 'success' && response.data) {
          if (showSuccessAlert) {
            toast.success('Sucesso', successMessage)
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
          toast.error('Erro', errorMsg)
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
            toast.success('Sucesso', successMessage)
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
          toast.error('Erro', errorMsg)
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
