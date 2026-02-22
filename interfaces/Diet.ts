import { Meal } from './Meal'
import { Gym } from './Gym'
import { User } from './User'

export interface Diet {
  id: number
  name: string
  description?: string
  userId?: number // user_id da API
  coachId?: number // coach_id da API
  gymId?: number // gym_id da API
  calories?: number
  proteins?: number
  carbohydrates?: number
  fats?: number
  // Campos embutidos apenas no GET /diets/:id
  meals?: Meal[]
  criador?: User
  gym?: Gym
  createdAt: string
  updatedAt: string
}
