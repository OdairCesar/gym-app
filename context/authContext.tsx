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
          const user: User = {
            nome: result.nome || '',
            email: result.email || '',
            password: result.password || '',
            dataNascimento: result.dataNascimento
              ? new Date(result.dataNascimento)
              : undefined,
            telefone: result.telefone || '',
            cpf: result.cpf || '',
            sexo: result.sexo || 'O',
            profissao: result.profissao || '',
            endereco: result.endereco || '',
            isAdmin: result.isAdmin || false,
            isActive: result.isActive || true,
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

  return (
    <AuthContext.Provider
      value={{ getIsAuthenticated, login, logout, getUser, getToken }}
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
