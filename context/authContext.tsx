import React, { createContext, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'

import { User } from '@/interfaces/User'

interface AuthContextType {
  getIsAuthenticated: () => Promise<boolean>
  login: (token: string, user: User) => Promise<void>
  logout: () => Promise<void>
  getUser: () => Promise<User | null>
  getToken: () => Promise<string | null>
  isAdmin: () => Promise<boolean>
  isPersonal: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()

  const getIsAuthenticated = async () => {
    const token = await AsyncStorage.getItem('userToken')

    return token !== null
  }

  const getUser = async () => {
    const userData = await AsyncStorage.getItem('userData')

    if (!userData) return null

    try {
      if (userData && typeof userData === 'string') {
        const result = JSON.parse(userData)

        if (result && typeof result === 'object') {
          // A API retorna snake_case (gym_id, birth_date, role etc.)
          // Suportamos ambos os formatos para garantir compatibilidade
          const role: string = result.role || ''

          const user: User = {
            id: result.id || 0,
            name: result.name || '',
            email: result.email || '',
            birthDate: result.birth_date || result.birthDate || undefined,
            phone: result.phone || '',
            cpf: result.cpf || '',
            gender: result.gender || 'O',
            profession: result.profession || '',
            address: result.address || '',
            gymId: result.gym_id ?? result.gymId ?? null,
            dietId: result.diet_id ?? result.dietId ?? null,
            trainingId: result.training_id ?? result.trainingId ?? null,
            isAdmin:
              role === 'admin' || role === 'super' || result.isAdmin || false,
            isPersonal: role === 'personal' || result.isPersonal || false,
            isActive: result.approved ?? result.isActive ?? true,
            createdAt: result.created_at || result.createdAt || '',
            updatedAt: result.updated_at || result.updatedAt || '',
          }

          return user
        }
      }

      return null
    } catch (error) {
      return null
    }
  }

  const getToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken')

    return userToken || null
  }

  const login = async (token: string, user: User) => {
    await AsyncStorage.setItem('userToken', token)

    await AsyncStorage.setItem('userData', JSON.stringify(user))
  }

  const logout = async () => {
    await AsyncStorage.removeItem('userToken')

    await AsyncStorage.removeItem('userData')

    router.replace('/(auth)/login')
  }

  const isAdmin = async () => {
    const user = await getUser()
    return user?.isAdmin || false
  }

  const isPersonal = async () => {
    const user = await getUser()
    return user?.isPersonal || false
  }

  return (
    <AuthContext.Provider
      value={{
        getIsAuthenticated,
        login,
        logout,
        getUser,
        getToken,
        isAdmin,
        isPersonal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider')

  return context
}
