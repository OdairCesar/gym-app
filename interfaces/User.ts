import { Gym } from './Gym'

export interface User {
  id: number
  name: string
  email: string
  password?: string // Não retorna da API em GET
  birthDate?: string // ISO string
  phone?: string
  cpf?: string
  gender?: 'M' | 'F' | 'O'
  profession?: string
  address?: string
  gymId?: number | null
  dietId?: number | null
  trainingId?: number | null
  role?: string       // "admin" | "personal" | "user" — retornado pelo GET
  approved?: number   // 0 | 1 — retornado pelo GET
  // Campos abaixo existem apenas no corpo do POST /users (não retornados no GET)
  isAdmin?: boolean
  isPersonal?: boolean
  isActive?: boolean
  createdAt: string
  updatedAt: string
  gym?: Gym // retornado em GET /users/:id
}

// Para registro
export interface RegisterUserRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
  birthDate?: string | null
  phone?: string | null
  cpf?: string | null
  gender?: 'M' | 'F' | 'O' | null
  profession?: string | null
  address?: string | null
  gymId?: number | null
  dietId?: number | null
  isAdmin?: boolean
  isPersonal?: boolean
}
