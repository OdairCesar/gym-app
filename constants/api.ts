/**
 * API Configuration
 * Centralized API endpoints and configuration
 */

// Base URL da API
export const API_BASE_URL = 'https://gym-api-24p5.onrender.com'

// Endpoints da API
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  CHANGE_PASSWORD: '/api/auth/change-password',

  // Training
  TRAINING: '/api/training',
  TRAINING_BY_ID: (id: string) => `/api/training/${id}`,

  // Diet
  DIET_ME: '/api/diet/me',

  // Products
  PRODUCTS: '/api/products',
  PRODUCT: '/api/product',

  // User
  USER: '/api/user',
  USER_PROFILE: '/api/user/profile',
} as const

/**
 * Helper function to build complete API URLs
 * @param endpoint - The endpoint path
 * @returns Complete URL
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`
}
