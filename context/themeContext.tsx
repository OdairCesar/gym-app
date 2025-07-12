import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useColorScheme } from 'react-native'

// Importar os temas
import {
  Colors as LightColors,
  GlobalStyles as LightGlobalStyles,
} from '../styles/globalStyles'
import { DarkColors, DarkGlobalStyles } from '../styles/darkTheme'

type ThemeType = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: ThemeType
  currentColors: typeof LightColors | typeof DarkColors
  currentStyles: typeof LightGlobalStyles | typeof DarkGlobalStyles
  isDark: boolean
  toggleTheme: () => void
  setTheme: (theme: ThemeType) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = 'app_theme'

export const ThemeProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>('system')
  const systemColorScheme = useColorScheme()

  // Determinar se o tema atual é escuro
  const isDark =
    theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark')

  // Selecionar cores e estilos baseados no tema
  const currentColors = isDark ? DarkColors : LightColors
  const currentStyles = isDark ? DarkGlobalStyles : LightGlobalStyles

  // Carregar tema salvo no AsyncStorage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY)
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeState(savedTheme as ThemeType)
        }
      } catch (error) {
        console.error('Erro ao carregar tema:', error)
      }
    }

    loadTheme()
  }, [])

  // Salvar tema no AsyncStorage
  const setTheme = async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme)
      setThemeState(newTheme)
    } catch (error) {
      console.error('Erro ao salvar tema:', error)
    }
  }

  // Alternar entre temas (light -> dark -> system -> light)
  const toggleTheme = () => {
    const themeOrder: ThemeType[] = ['light', 'dark', 'system']
    const currentIndex = themeOrder.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themeOrder.length
    setTheme(themeOrder[nextIndex])
  }

  const value: ThemeContextType = {
    theme,
    currentColors,
    currentStyles,
    isDark,
    toggleTheme,
    setTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider')
  }
  return context
}
