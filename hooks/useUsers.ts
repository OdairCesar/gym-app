import { useState, useCallback } from 'react'
import { useAuth } from '@/context/authContext'
import { User } from '@/interfaces/User'
import { userService } from '@/services/userService'
import { useApi } from './useApi'
import { ENV } from '@/constants/environment'
import { extractList } from '@/utils/apiUtils'

interface UseUsersReturn {
  // Estados
  personals: User[]
  clients: User[]
  users: User[]
  currentUser: User | null
  loading: boolean

  // Funções
  fetchPersonals: () => Promise<void>
  fetchClients: () => Promise<void>
  fetchUsers: () => Promise<void>
  fetchCurrentUser: () => Promise<void>
  createUser: (userData: Partial<User>) => Promise<boolean>
  updateUser: (userId: number, userData: Partial<User>) => Promise<boolean>
  deleteUser: (userId: number) => Promise<boolean>
  refreshUsers: () => Promise<void>
  assignDietToClient: (clientId: number, dietId: number) => Promise<boolean>
  assignTrainingToClient: (
    clientId: number,
    trainingId: number,
  ) => Promise<boolean>

  // Aprovação
  pendingUsers: User[]
  fetchPendingUsers: () => Promise<void>
  approveUser: (userId: number) => Promise<boolean>
  rejectUser: (userId: number) => Promise<boolean>

  // Utilitários
  getPersonalName: (personalId: number) => string
  getClientName: (clientId: number) => string
  filterUsers: (filters: {
    name?: string
    email?: string
    gender?: string
    role?: string
    isActive?: boolean
  }) => User[]
}

export const useUsers = (): UseUsersReturn => {
  const { getUser } = useAuth()
  const { executeWithAuth } = useApi()

  const [personals, setPersonals] = useState<User[]>([])
  const [clients, setClients] = useState<User[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [pendingUsers, setPendingUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchPersonals = useCallback(async () => {
    try {
      setLoading(true)
      const result = await executeWithAuth(
        (token) => userService.fetchUsers(token),
        {
          showErrorAlert: true,
          errorMessage: 'Falha ao carregar personals',
        },
      )

      if (result) {
        const personalsData = userService.getPersonals(
          extractList<User>(result),
        )
        setPersonals(personalsData)
      }
    } catch (error) {
      console.error('Erro ao carregar personals:', error)
    } finally {
      setLoading(false)
    }
  }, [executeWithAuth])

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true)
      const result = await executeWithAuth(
        (token) => userService.fetchUsers(token),
        {
          showErrorAlert: true,
          errorMessage: 'Falha ao carregar clientes',
        },
      )

      if (result) {
        const clientsData = userService.getClients(extractList<User>(result))
        setClients(clientsData)
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
    } finally {
      setLoading(false)
    }
  }, [executeWithAuth])

  const fetchCurrentUser = useCallback(async () => {
    try {
      const user = await getUser()
      if (user) {
        setCurrentUser(user)
      }
    } catch (error) {
      console.error('Erro ao carregar usuário atual:', error)
    }
  }, [getUser])

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const result = await executeWithAuth(
        (token) => userService.fetchUsers(token),
        {
          showErrorAlert: true,
          errorMessage: 'Falha ao carregar usuários',
        },
      )

      if (result) {
        setUsers(extractList<User>(result))
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setLoading(false)
    }
  }, [executeWithAuth])

  const createUser = useCallback(
    async (userData: Partial<User>): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => userService.createUser(userData, token),
        {
          showSuccessAlert: false,
          successMessage: 'Usuário criado com sucesso',
          errorMessage: 'Falha ao criar usuário',
        },
      )

      if (result) {
        await fetchUsers()
        return true
      }

      return false
    },
    [executeWithAuth, fetchUsers],
  )

  const updateUser = useCallback(
    async (userId: number, userData: Partial<User>): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => userService.updateUser(userId, userData, token),
        {
          showSuccessAlert: false,
          successMessage: 'Usuário atualizado com sucesso',
          errorMessage: 'Falha ao atualizar usuário',
        },
      )

      if (result) {
        await fetchUsers()
        return true
      }

      return false
    },
    [executeWithAuth, fetchUsers],
  )

  const deleteUser = useCallback(
    async (userId: number): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => userService.deleteUser(userId, token),
        {
          showSuccessAlert: false,
          successMessage: 'Usuário deletado com sucesso',
          errorMessage: 'Falha ao deletar usuário',
        },
      )

      if (result) {
        await fetchUsers()
        return true
      }

      return false
    },
    [executeWithAuth, fetchUsers],
  )

  const fetchPendingUsers = useCallback(async () => {
    try {
      setLoading(true)
      const result = await executeWithAuth(
        (token) => userService.fetchPendingUsers(token),
        {
          showErrorAlert: true,
          errorMessage: 'Falha ao carregar usuários pendentes',
        },
      )
      if (result) setPendingUsers(extractList<User>(result))
    } catch (error) {
      console.error('Erro ao carregar usuários pendentes:', error)
    } finally {
      setLoading(false)
    }
  }, [executeWithAuth])

  const approveUser = useCallback(
    async (userId: number): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => userService.approveUser(userId, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Usuário aprovado com sucesso',
          errorMessage: 'Falha ao aprovar usuário',
        },
      )
      if (result !== null) {
        await fetchPendingUsers()
        return true
      }
      return false
    },
    [executeWithAuth, fetchPendingUsers],
  )

  const rejectUser = useCallback(
    async (userId: number): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => userService.rejectUser(userId, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Usuário rejeitado',
          errorMessage: 'Falha ao rejeitar usuário',
        },
      )
      if (result !== null) {
        await fetchPendingUsers()
        return true
      }
      return false
    },
    [executeWithAuth, fetchPendingUsers],
  )

  const refreshUsers = useCallback(async () => {
    await Promise.all([fetchPersonals(), fetchClients(), fetchCurrentUser()])
  }, [fetchPersonals, fetchClients, fetchCurrentUser])

  const assignDietToClient = useCallback(
    async (clientId: number, dietId: number): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => userService.assignDietToUser(clientId, dietId, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Dieta atribuída ao cliente com sucesso',
          errorMessage: 'Falha ao atribuir dieta',
        },
      )

      if (result) {
        await fetchClients()
        return true
      }

      return false
    },
    [executeWithAuth, fetchClients],
  )

  const assignTrainingToClient = useCallback(
    async (clientId: number, trainingId: number): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) =>
          userService.assignTrainingToUser(clientId, trainingId, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Treino atribuído ao cliente com sucesso',
          errorMessage: 'Falha ao atribuir treino',
        },
      )

      if (result) {
        await fetchClients()
        return true
      }

      return false
    },
    [executeWithAuth, fetchClients],
  )
  const getPersonalName = useCallback(
    (personalId: number): string => {
      const personal = personals.find((p) => p.id === personalId)
      return personal?.name || 'Personal não encontrado'
    },
    [personals],
  )

  const getClientName = useCallback(
    (clientId: number): string => {
      const client = clients.find((c) => c.id === clientId)
      return client?.name || 'Cliente não encontrado'
    },
    [clients],
  )

  const filterUsers = useCallback(
    (filters: {
      name?: string
      email?: string
      gender?: string
      role?: string
      isActive?: boolean
    }): User[] => {
      return users.filter((user) => {
        if (
          filters.name &&
          !user.name.toLowerCase().includes(filters.name.toLowerCase())
        ) {
          return false
        }
        if (
          filters.email &&
          !user.email.toLowerCase().includes(filters.email.toLowerCase())
        ) {
          return false
        }
        if (filters.gender && user.gender !== filters.gender) {
          return false
        }
        if (filters.role && user.role !== filters.role) {
          return false
        }
        if (
          filters.isActive !== undefined &&
          Boolean(user.approved) !== filters.isActive
        ) {
          return false
        }
        return true
      })
    },
    [users],
  )

  return {
    // Estados
    personals,
    clients,
    users,
    pendingUsers,
    currentUser,
    loading,

    // Funções
    fetchPersonals,
    fetchClients,
    fetchUsers,
    fetchCurrentUser,
    createUser,
    updateUser,
    deleteUser,
    refreshUsers,
    assignDietToClient,
    assignTrainingToClient,

    // Aprovação
    fetchPendingUsers,
    approveUser,
    rejectUser,

    // Utilitários
    getPersonalName,
    getClientName,
    filterUsers,
  }
}
