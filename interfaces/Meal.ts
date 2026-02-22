import { Food } from './Food'

export interface Meal {
  id: number
  dietId: number
  name: string
  hourly: string // Formato: "08:00"
  description?: string
  // Campos embutidos no GET /diets/:id
  foods?: Food[]
  createdAt: string
  updatedAt: string
}
