import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'

interface AuthContextType {
  getIsAuthenticated: () => Promise<boolean>
  login: (token: string, user: any) => Promise<void>
  logout: () => Promise<void>
  getUser: () => Promise<any>
  getToken: () => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()

  const getIsAuthenticated = async () => {
    console.log('Rodando o getIsAuthenticated')
    const token = await AsyncStorage.getItem('userToken')
    return token !== null
  }

  const getUser = async () => {
    console.log('Rodando o user')
    const userData = await AsyncStorage.getItem('userData')
    return userData ? JSON.parse(userData) : null
  }

  const getToken = async () => {
    console.log('Rodando o user')
    const userToken = await AsyncStorage.getItem('userToken')
    return userToken || null
  }

  const login = async (token: string, user: any) => {
    console.log('Rodando o login')
    await AsyncStorage.setItem('userToken', token)
    await AsyncStorage.setItem('userData', JSON.stringify(user))
  }

  const logout = async () => {
    console.log('Rodando o logout')
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
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
