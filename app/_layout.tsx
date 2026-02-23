import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'

import Toast, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message'
import { AuthProvider } from '@/context/authContext'
import { ThemeProvider, useTheme } from '@/context/themeContext'

export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
  // initialRouteName removido - agora usando index.tsx
}

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  return (
    <ThemeProvider>
      <NavigationContainer />
    </ThemeProvider>
  )
}

function NavigationContainer() {
  const { isDark, currentColors } = useTheme()

  // Opções dinâmicas para os headers das modais
  const modalHeaderOptions = {
    headerStyle: {
      backgroundColor: currentColors.backgroundSecondary,
    },
    headerTintColor: currentColors.text,
    headerTitleStyle: {
      color: currentColors.text,
    },
  }

  return (
    <>
      <StatusBarController />
      <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <AuthProvider>

          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(client)" options={{ headerShown: false }} />
            <Stack.Screen name="(admin)" options={{ headerShown: false }} />
            <Stack.Screen name="(personal)" options={{ headerShown: false }} />
            <Stack.Screen
              name="trainingExercise"
              options={{
                headerShown: true,
                presentation: 'modal',
                title: 'Exercicios',
                ...modalHeaderOptions,
              }}
            />
            <Stack.Screen
              name="changePassword"
              options={{
                headerShown: true,
                presentation: 'modal',
                title: 'Trocar Senha',
                ...modalHeaderOptions,
              }}
            />
            <Stack.Screen
              name="editProfile"
              options={{
                headerShown: true,
                presentation: 'modal',
                title: 'Editar Perfil',
                ...modalHeaderOptions,
              }}
            />
          </Stack>
        </AuthProvider>
      </NavigationThemeProvider>
      <ThemedToast />
    </>
  )
}

function ThemedToast() {
  const { currentColors } = useTheme()

  const toastConfig: ToastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: currentColors.success,
          backgroundColor: currentColors.backgroundSecondary,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{ color: currentColors.text, fontSize: 14, fontWeight: '600' }}
        text2Style={{ color: currentColors.textSecondary, fontSize: 12 }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: currentColors.error,
          backgroundColor: currentColors.backgroundSecondary,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{ color: currentColors.text, fontSize: 14, fontWeight: '600' }}
        text2Style={{ color: currentColors.textSecondary, fontSize: 12 }}
      />
    ),
    info: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: currentColors.info,
          backgroundColor: currentColors.backgroundSecondary,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{ color: currentColors.text, fontSize: 14, fontWeight: '600' }}
        text2Style={{ color: currentColors.textSecondary, fontSize: 12 }}
      />
    ),
  }

  return <Toast config={toastConfig} />
}

function StatusBarController() {
  const { isDark } = useTheme()

  return (
    <StatusBar
      style={isDark ? 'light' : 'dark'}
      backgroundColor={isDark ? '#1C1C1E' : '#F2F2F7'}
      translucent={false}
    />
  )
}
