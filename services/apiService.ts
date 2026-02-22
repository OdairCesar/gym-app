import { API_BASE_URL } from '@/constants/api'

export interface ApiResponse<T> {
  status: 'success' | 'error'
  data?: T
  message?: string
  statusCode?: number
  validationErrors?: { field: string; message: string }[]
}

export class ApiService {
  private baseUrl: string
  private debugMode: boolean

  constructor(
    baseUrl: string = API_BASE_URL,
    debug: boolean = __DEV__ || false,
  ) {
    this.baseUrl = baseUrl
    this.debugMode = debug
  }

  private log(message: string, data?: unknown): void {
    if (this.debugMode) {
      console.log(`[API Service] ${message}`, data || '')
    }
  }

  private logError(message: string, error?: unknown): void {
    if (this.debugMode) {
      console.error(`[API Service ERROR] ${message}`, error || '')
    }
  }

  private sanitizeData(data: unknown): unknown {
    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data }
      const sensitiveFields = ['password', 'token', 'authorization', 'secret']

      for (const field of sensitiveFields) {
        if (field in sanitized) {
          ;(sanitized as Record<string, unknown>)[field] = '***HIDDEN***'
        }
      }

      return sanitized
    }
    return data
  }

  private getHttpErrorMessage(status: number, serverMessage?: string): string {
    switch (status) {
      case 400:
        return serverMessage || 'Requisição inválida'
      case 401:
        return 'Sessão expirada. Faça login novamente'
      case 403:
        return 'Sem permissão para realizar esta ação'
      case 404:
        return serverMessage || 'Recurso não encontrado'
      case 409:
        return serverMessage || 'Conflito: o recurso já existe'
      case 422:
        return serverMessage || 'Dados inválidos. Verifique os campos'
      case 429:
        return 'Muitas requisições. Aguarde um momento'
      case 500:
        return 'Erro interno no servidor. Tente novamente'
      case 503:
        return 'Serviço temporariamente indisponível'
      default:
        return serverMessage || `Erro ${status}`
    }
  }

  private extractValidationErrors(
    data: unknown,
  ): { field: string; message: string }[] {
    if (
      typeof data === 'object' &&
      data !== null &&
      'errors' in data &&
      Array.isArray((data as { errors: unknown }).errors)
    ) {
      const rawErrors = (data as { errors: unknown[] }).errors
      return rawErrors
        .map((e) => {
          if (typeof e === 'object' && e !== null) {
            const err = e as Record<string, unknown>
            return {
              field: String(err.field || err.path || 'campo'),
              message: String(err.message || err.msg || 'Valor inválido'),
            }
          }
          return null
        })
        .filter(Boolean) as { field: string; message: string }[]
    }
    return []
  }

  private toCamelCase(key: string): string {
    return key.replace(/_([a-z])/g, (_, letter: string) =>
      letter.toUpperCase(),
    )
  }

  /**
   * Converte todas as chaves snake_case para camelCase recursivamente.
   * Aplicado em todas as respostas da API para uniformidade.
   */
  private normalizeKeys(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => this.normalizeKeys(item))
    }
    if (value !== null && typeof value === 'object') {
      const result: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(
        value as Record<string, unknown>,
      )) {
        result[this.toCamelCase(k)] = this.normalizeKeys(v)
      }
      return result
    }
    return value
  }

  public setDebugMode(enabled: boolean): void {
    this.debugMode = enabled
    this.log(`Debug mode ${enabled ? 'enabled' : 'disabled'}`)
  }

  public isDebugEnabled(): boolean {
    return this.debugMode
  }

  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const startTime = Date.now()
    const url = this.buildUrl(endpoint)

    try {
      this.log(`🚀 REQUEST: ${options.method || 'GET'} ${url}`, {
        headers: this.sanitizeData(options.headers),
        body: options.body
          ? this.sanitizeData(JSON.parse(options.body as string))
          : undefined,
      })

      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      const data = await response.json()
      const duration = Date.now() - startTime

      this.log(
        `📥 RESPONSE: ${response.status} ${response.statusText} (${duration}ms)`,
        {
          url,
          status: response.status,
          data,
          duration: `${duration}ms`,
        },
      )

      if (!response.ok) {
        this.logError(
          `❌ API Error: ${response.status} ${response.statusText}`,
          {
            url,
            status: response.status,
            response: data,
            duration: `${duration}ms`,
          },
        )

        const message = this.getHttpErrorMessage(
          response.status,
          (data as { message?: string })?.message,
        )
        const validationErrors =
          response.status === 422 ? this.extractValidationErrors(data) : []

        return {
          status: 'error',
          message,
          statusCode: response.status,
          validationErrors,
        }
      }

      this.log(`✅ SUCCESS: ${options.method || 'GET'} ${endpoint}`, {
        responseData: data.data || data,
        duration: `${duration}ms`,
      })

      const rawData = data.data !== undefined ? data.data : data
      return {
        status: 'success',
        data: this.normalizeKeys(rawData) as T,
      }
    } catch (error) {
      const duration = Date.now() - startTime

      this.logError(
        `💥 NETWORK ERROR: ${options.method || 'GET'} ${endpoint}`,
        {
          url,
          error: error instanceof Error ? error.message : error,
          duration: `${duration}ms`,
        },
      )

      return {
        status: 'error',
        message:
          error instanceof Error
            ? error.message.includes('Network request failed') ||
              error.message.includes('fetch')
              ? 'Sem conexão com a internet. Verifique sua rede'
              : error.message
            : 'Erro de conexão',
        statusCode: 0,
      }
    }
  }

  async get<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    token?: string,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    token?: string,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    token?: string,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: data ? JSON.stringify(data) : undefined,
    })
  }
}

export const apiService = new ApiService()

// Exemplo de uso do debug:
// apiService.setDebugMode(true)  // Ativar debug
// apiService.setDebugMode(false) // Desativar debug
// console.log(apiService.isDebugEnabled()) // Verificar status do debug

/*
  Debug Features Incluídas:
  
  🚀 REQUEST: Mostra método, URL, headers e body da requisição
  📥 RESPONSE: Mostra status, dados e tempo de resposta
  ❌ API Error: Mostra erros da API com detalhes
  💥 NETWORK ERROR: Mostra erros de rede/conexão
  
  - Dados sensíveis (password, token, etc.) são automaticamente ocultados
  - Logs incluem tempo de duração das requisições
  - Debug pode ser ativado/desativado em runtime
  - Logs aparecem apenas quando debug está ativado
*/
