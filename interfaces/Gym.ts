export interface Gym {
  id: number
  name: string
  description?: string
  address?: string
  phone?: string
  email?: string
  cnpj?: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface GymStats {
  totalUsers: number
  totalTrainings: number
  totalDiets: number
  totalProducts: number
  activeUsers: number
}
