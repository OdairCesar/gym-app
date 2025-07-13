/**
 * API Configuration
 * Centralized API endpoints and configuration
 */

// Base URL da API
export const API_BASE_URL = 'https://gym-api-24p5.onrender.com'
// export const API_BASE_URL = 'http://192.168.1.93:8844'

// Endpoints da API
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  CHANGE_PASSWORD: '/api/auth/change-password',

  // Training
  TRAINING: '/api/training',
  TRAINING_BY_ID: (id: string) => `/api/training/${id}`,
  TRAINING_ME: '/api/training/me',

  // Diet
  DIET: '/api/diet',
  DIET_BY_ID: (id: string) => `/api/diet/${id}`,
  DIET_ME: '/api/diet/me',

  // Products
  PRODUCT: '/api/product',
  PRODUCT_BY_ID: (id: string) => `/api/product/${id}`,

  // User
  USER: '/api/user',
  USER_BY_ID: (id: string) => `/api/user/${id}`,
  USER_ME: '/api/user/me',
} as const

/**
 * Helper function to build complete API URLs
 * @param endpoint - The endpoint path
 * @returns Complete URL
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`
}
