import { GymPermission, UserPermission } from '@/interfaces/Permission'

/**
 * Verifica se o array de permissões de academia contém uma permissão
 * para a academia especificada com a ação especificada.
 */
export function hasGymPermission(
  permissions: GymPermission[],
  gymId: number,
  action?: string,
): boolean {
  return permissions.some((p) => {
    const gymMatch = p.gymId === gymId
    const actionMatch =
      !action || p.action === action || p.action === 'manage_all'
    return gymMatch && actionMatch
  })
}

/**
 * Verifica se o usuário tem permissão total (manage_all) em uma academia.
 */
export function hasFullGymAccess(
  permissions: GymPermission[],
  gymId: number,
): boolean {
  return permissions.some(
    (p) =>
      p.gymId === gymId && (p.action === 'manage_all' || p.resource === '*'),
  )
}

/**
 * Verifica se o array de permissões de usuário contém a ação especificada.
 */
export function hasUserPermission(
  permissions: UserPermission[],
  action: string,
  resource?: string,
  resourceId?: number,
): boolean {
  return permissions.some((p) => {
    const actionMatch = p.action === action
    const resourceMatch =
      !resource || p.resource === resource || p.resource === '*'
    const idMatch =
      resourceId === undefined ||
      p.resourceId == null ||
      p.resourceId === resourceId
    return actionMatch && resourceMatch && idMatch
  })
}

/**
 * Verifica se o usuário pode visualizar um treino específico.
 */
export function canViewTraining(
  permissions: UserPermission[],
  trainingId?: number,
): boolean {
  return hasUserPermission(
    permissions,
    'view_training',
    'trainings',
    trainingId,
  )
}

/**
 * Verifica se o usuário pode editar um treino específico.
 */
export function canEditTraining(
  permissions: UserPermission[],
  trainingId?: number,
): boolean {
  return hasUserPermission(
    permissions,
    'edit_training',
    'trainings',
    trainingId,
  )
}

/**
 * Verifica se o usuário pode visualizar uma dieta específica.
 */
export function canViewDiet(
  permissions: UserPermission[],
  dietId?: number,
): boolean {
  return hasUserPermission(permissions, 'view_diet', 'diets', dietId)
}

/**
 * Verifica se o usuário pode editar uma dieta específica.
 */
export function canEditDiet(
  permissions: UserPermission[],
  dietId?: number,
): boolean {
  return hasUserPermission(permissions, 'edit_diet', 'diets', dietId)
}

/**
 * Filtra permissões de academia por gymId.
 */
export function filterGymPermissionsByGym(
  permissions: GymPermission[],
  gymId: number,
): GymPermission[] {
  return permissions.filter((p) => p.gymId === gymId)
}

/**
 * Filtra permissões de usuário por userId.
 */
export function filterUserPermissionsByUser(
  permissions: UserPermission[],
  userId: number,
): UserPermission[] {
  return permissions.filter((p) => p.userId === userId)
}
