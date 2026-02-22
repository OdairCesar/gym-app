import { Exercise } from './Exercise'
import { Gym } from './Gym'
import { User } from './User'

export interface Training {
  id: number
  name: string
  description?: string
  userId?: number // user_id da API
  coachId?: number // coach_id da API
  gymId?: number // gym_id da API
  isReusable?: boolean
  // Campos embutidos apenas no GET /trainings/:id
  exercises?: Exercise[]
  gym?: Gym
  coach?: User
  user?: User
  createdAt: string
  updatedAt: string
}

// Para associar exercício a treino
export interface TrainingExerciseAssociation {
  training_id: number
  exercise_id: number
}
