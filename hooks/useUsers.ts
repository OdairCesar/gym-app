import { useState, useCallback } from 'react'
import { useAuth } from '@/context/authContext'
import { User } from '@/interfaces/User'
import { userService } from '@/services/userService'
import { useApi } from './useApi'

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
  updateUser: (userId: string, userData: Partial<User>) => Promise<boolean>
  deleteUser: (userId: string) => Promise<boolean>
  refreshUsers: () => Promise<void>
  assignDietToClient: (clientId: string, dietId: string) => Promise<boolean>
  assignTrainingToClient: (
    clientId: string,
    trainingId: string,
  ) => Promise<boolean>

  // Utilitários
  getPersonalName: (personalId: string) => string
  getClientName: (clientId: string) => string
  filterUsers: (filters: {
    nome?: string
    email?: string
    sexo?: string
    isAdmin?: boolean
    isPersonal?: boolean
    isActive?: boolean
  }) => User[]
}

export const useUsers = (): UseUsersReturn => {
  const { getUser } = useAuth()
  const { executeWithAuth } = useApi()

  const [personals, setPersonals] = useState<User[]>([])
  const [clients, setClients] = useState<User[]>([])
  const [users, setUsers] = useState<User[]>([])
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
        const personalsData = userService.getPersonals(result)
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
        const clientsData = userService.getClients(result)
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
        setUsers(result)
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
          showSuccessAlert: true,
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
    async (userId: string, userData: Partial<User>): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => userService.updateUser(userId, userData, token),
        {
          showSuccessAlert: true,
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
    async (userId: string): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => userService.deleteUser(userId, token),
        {
          showSuccessAlert: true,
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

  const refreshUsers = useCallback(async () => {
    await Promise.all([fetchPersonals(), fetchClients(), fetchCurrentUser()])
  }, [fetchPersonals, fetchClients, fetchCurrentUser])

  const assignDietToClient = useCallback(
    async (clientId: string, dietId: string): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => userService.assignDietToUser(clientId, dietId, token),
        {
          showSuccessAlert: true,
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
    async (clientId: string, trainingId: string): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) =>
          userService.assignTrainingToUser(clientId, trainingId, token),
        {
          showSuccessAlert: true,
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
    (personalId: string): string => {
      const personal = userService.getUserById(personals, personalId)
      return personal?.nome || 'Personal não encontrado'
    },
    [personals],
  )

  const getClientName = useCallback(
    (clientId: string): string => {
      const client = userService.getUserById(clients, clientId)
      return client?.nome || 'Cliente não encontrado'
    },
    [clients],
  )

  const filterUsers = useCallback(
    (filters: {
      nome?: string
      email?: string
      sexo?: string
      isAdmin?: boolean
      isPersonal?: boolean
      isActive?: boolean
    }): User[] => {
      return users.filter((user) => {
        if (
          filters.nome &&
          !user.nome.toLowerCase().includes(filters.nome.toLowerCase())
        ) {
          return false
        }
        if (
          filters.email &&
          !user.email.toLowerCase().includes(filters.email.toLowerCase())
        ) {
          return false
        }
        if (filters.sexo && user.sexo !== filters.sexo) {
          return false
        }
        if (filters.isAdmin !== undefined && user.isAdmin !== filters.isAdmin) {
          return false
        }
        if (
          filters.isPersonal !== undefined &&
          user.isPersonal !== filters.isPersonal
        ) {
          return false
        }
        if (
          filters.isActive !== undefined &&
          user.isActive !== filters.isActive
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

    // Utilitários
    getPersonalName,
    getClientName,
    filterUsers,
  }
}
