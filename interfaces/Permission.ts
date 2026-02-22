export interface GymPermission {
  id: number
  gymId: number
  action: string // "manage_products", "manage_all", etc
  resource: string // "products", "*", etc
  createdAt: string
  updatedAt: string
}

export interface UserPermission {
  id: number
  userId: number
  grantedById: number
  action: string // "view_training", "edit_training", etc
  resource: string // "trainings", "diets", etc
  resourceId?: number | null
  createdAt: string
  updatedAt: string
}
