import { API_BASE_URL } from '@/constants/api'

export interface ApiResponse<T> {
  status: 'success' | 'error'
  data?: T
  message?: string
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

        return {
          status: 'error',
          message: data.message || 'Erro na requisição',
        }
      }

      this.log(`✅ SUCCESS: ${options.method || 'GET'} ${endpoint}`, {
        responseData: data.data || data,
        duration: `${duration}ms`,
      })

      return {
        status: 'success',
        data: data.data || data,
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
        message: error instanceof Error ? error.message : 'Erro desconhecido',
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
