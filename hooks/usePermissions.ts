import { useState, useCallback } from 'react'
import { GymPermission, UserPermission } from '@/interfaces/Permission'
import { permissionService } from '@/services/permissionService'
import { useApi } from './useApi'
import { ENV } from '@/constants/environment'
import { extractList } from '@/utils/apiUtils'

// ─── Gym Permissions Hook ────────────────────────────────────────────────────

interface UseGymPermissionsReturn {
  gymPermissions: GymPermission[]
  myGymPermissions: GymPermission[]
  loading: boolean
  fetchGymPermissions: () => Promise<void>
  fetchMyGymPermissions: () => Promise<void>
  createGymPermission: (data: Partial<GymPermission>) => Promise<boolean>
  updateGymPermission: (
    id: number,
    data: Partial<GymPermission>,
  ) => Promise<boolean>
  deleteGymPermission: (id: number) => Promise<boolean>
}

export const useGymPermissions = (): UseGymPermissionsReturn => {
  const { executeWithAuth } = useApi()
  const [gymPermissions, setGymPermissions] = useState<GymPermission[]>([])
  const [myGymPermissions, setMyGymPermissions] = useState<GymPermission[]>([])
  const [loading, setLoading] = useState(false)

  const fetchGymPermissions = useCallback(async () => {
    try {
      setLoading(true)
      const result = await executeWithAuth(
        (token) => permissionService.fetchGymPermissions(token),
        {
          showErrorAlert: true,
          errorMessage: 'Falha ao carregar permissões de academia',
        },
      )
      if (result) setGymPermissions(extractList<GymPermission>(result))
    } catch (error) {
      console.error('Erro ao carregar permissões de academia:', error)
    } finally {
      setLoading(false)
    }
  }, [executeWithAuth])

  const fetchMyGymPermissions = useCallback(async () => {
    try {
      setLoading(true)
      const result = await executeWithAuth(
        (token) => permissionService.fetchMyGymPermissions(token),
        {
          showErrorAlert: true,
          errorMessage: 'Falha ao carregar minhas permissões',
        },
      )
      if (result) setMyGymPermissions(extractList<GymPermission>(result))
    } catch (error) {
      console.error('Erro ao carregar minhas permissões:', error)
    } finally {
      setLoading(false)
    }
  }, [executeWithAuth])

  const createGymPermission = useCallback(
    async (data: Partial<GymPermission>): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => permissionService.createGymPermission(data, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Permissão criada com sucesso',
          errorMessage: 'Falha ao criar permissão',
        },
      )
      if (result) {
        await fetchGymPermissions()
        return true
      }
      return false
    },
    [executeWithAuth, fetchGymPermissions],
  )

  const updateGymPermission = useCallback(
    async (id: number, data: Partial<GymPermission>): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => permissionService.updateGymPermission(id, data, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Permissão atualizada com sucesso',
          errorMessage: 'Falha ao atualizar permissão',
        },
      )
      if (result) {
        await fetchGymPermissions()
        return true
      }
      return false
    },
    [executeWithAuth, fetchGymPermissions],
  )

  const deleteGymPermission = useCallback(
    async (id: number): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => permissionService.deleteGymPermission(id, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Permissão removida com sucesso',
          errorMessage: 'Falha ao remover permissão',
        },
      )
      if (result !== null) {
        await fetchGymPermissions()
        return true
      }
      return false
    },
    [executeWithAuth, fetchGymPermissions],
  )

  return {
    gymPermissions,
    myGymPermissions,
    loading,
    fetchGymPermissions,
    fetchMyGymPermissions,
    createGymPermission,
    updateGymPermission,
    deleteGymPermission,
  }
}

// ─── User Permissions Hook ───────────────────────────────────────────────────

interface UseUserPermissionsReturn {
  userPermissions: UserPermission[]
  grantedToMePermissions: UserPermission[]
  loading: boolean
  fetchUserPermissions: () => Promise<void>
  fetchPermissionsGrantedToMe: () => Promise<void>
  createUserPermission: (data: Partial<UserPermission>) => Promise<boolean>
  updateUserPermission: (
    id: number,
    data: Partial<UserPermission>,
  ) => Promise<boolean>
  deleteUserPermission: (id: number) => Promise<boolean>
}

export const useUserPermissions = (): UseUserPermissionsReturn => {
  const { executeWithAuth } = useApi()
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([])
  const [grantedToMePermissions, setGrantedToMePermissions] = useState<
    UserPermission[]
  >([])
  const [loading, setLoading] = useState(false)

  const fetchUserPermissions = useCallback(async () => {
    try {
      setLoading(true)
      const result = await executeWithAuth(
        (token) => permissionService.fetchUserPermissions(token),
        {
          showErrorAlert: true,
          errorMessage: 'Falha ao carregar permissões de usuários',
        },
      )
      if (result) setUserPermissions(extractList<UserPermission>(result))
    } catch (error) {
      console.error('Erro ao carregar permissões de usuários:', error)
    } finally {
      setLoading(false)
    }
  }, [executeWithAuth])

  const fetchPermissionsGrantedToMe = useCallback(async () => {
    try {
      setLoading(true)
      const result = await executeWithAuth(
        (token) => permissionService.fetchPermissionsGrantedToMe(token),
        {
          showErrorAlert: true,
          errorMessage: 'Falha ao carregar permissões concedidas',
        },
      )
      if (result) setGrantedToMePermissions(extractList<UserPermission>(result))
    } catch (error) {
      console.error('Erro ao carregar permissões concedidas:', error)
    } finally {
      setLoading(false)
    }
  }, [executeWithAuth])

  const createUserPermission = useCallback(
    async (data: Partial<UserPermission>): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => permissionService.createUserPermission(data, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Permissão concedida com sucesso',
          errorMessage: 'Falha ao conceder permissão',
        },
      )
      if (result) {
        await fetchUserPermissions()
        return true
      }
      return false
    },
    [executeWithAuth, fetchUserPermissions],
  )

  const updateUserPermission = useCallback(
    async (id: number, data: Partial<UserPermission>): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => permissionService.updateUserPermission(id, data, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Permissão atualizada com sucesso',
          errorMessage: 'Falha ao atualizar permissão',
        },
      )
      if (result) {
        await fetchUserPermissions()
        return true
      }
      return false
    },
    [executeWithAuth, fetchUserPermissions],
  )

  const deleteUserPermission = useCallback(
    async (id: number): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => permissionService.deleteUserPermission(id, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Permissão removida com sucesso',
          errorMessage: 'Falha ao remover permissão',
        },
      )
      if (result !== null) {
        await fetchUserPermissions()
        return true
      }
      return false
    },
    [executeWithAuth, fetchUserPermissions],
  )

  return {
    userPermissions,
    grantedToMePermissions,
    loading,
    fetchUserPermissions,
    fetchPermissionsGrantedToMe,
    createUserPermission,
    updateUserPermission,
    deleteUserPermission,
  }
}
