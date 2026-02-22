/**
 * API Configuration
 * Centralized API endpoints and configuration
 */

// Base URL da API
// Dispositivo físico (Android/iOS) na mesma rede Wi-Fi:
export const API_BASE_URL = 'http://192.168.1.6:3333'

// Endpoints da API
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  AUTH_ME: '/auth/me',

  // Users
  USERS: '/users',
  USER_BY_ID: (id: number) => `/users/${id}`,
  PENDING_USERS: '/users/pending-users',
  APPROVE_USER: (id: number) => `/users/${id}/approve-user`,
  REJECT_USER: (id: number) => `/users/${id}/reject-user`,

  // Gyms
  GYMS: '/gyms',
  GYM_BY_ID: (id: number) => `/gyms/${id}`,
  GYM_STATS: (id: number) => `/gyms/${id}/stats`,

  // Diets
  DIETS: '/diets',
  DIET_BY_ID: (id: number) => `/diets/${id}`,

  // Meals
  DIET_MEALS: (dietId: number) => `/diets/${dietId}/meals`,
  DIET_MEAL_BY_ID: (dietId: number, mealId: number) =>
    `/diets/${dietId}/meals/${mealId}`,

  // Foods
  MEAL_FOODS: (mealId: number) => `/meals/${mealId}/foods`,
  MEAL_FOOD_BY_ID: (mealId: number, foodId: number) =>
    `/meals/${mealId}/foods/${foodId}`,

  // Trainings
  TRAININGS: '/trainings',
  TRAINING_BY_ID: (id: number) => `/trainings/${id}`,
  TRAINING_EXERCISES: (id: number) => `/trainings/${id}/exercises`,
  TRAINING_EXERCISE_BY_ID: (trainingId: number, exerciseId: number) =>
    `/trainings/${trainingId}/exercises/${exerciseId}`,

  // Exercises
  EXERCISES: '/exercises',
  EXERCISE_BY_ID: (id: number) => `/exercises/${id}`,

  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: number) => `/products/${id}`,
  PRODUCT_STOCK: (id: number) => `/products/${id}/stock`,

  // Gym Permissions
  GYM_PERMISSIONS: '/gym-permissions',
  MY_GYM_PERMISSIONS: '/gym-permissions/my-permissions',
  GYM_PERMISSION_BY_ID: (id: number) => `/gym-permissions/${id}`,

  // User Permissions
  USER_PERMISSIONS: '/user-permissions',
  PERMISSIONS_GRANTED_TO_ME: '/user-permissions/granted-to-me',
  USER_PERMISSION_BY_ID: (id: number) => `/user-permissions/${id}`,
} as const

/**
 * Helper function to build complete API URLs
 * @param endpoint - The endpoint path
 * @returns Complete URL
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`
}
