import { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'

import { AuthProvider, useAuth } from '@/context/authContext'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function AuthLayoutNav() {
  const { getIsAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await getIsAuthenticated()

      if (isAuth) {
        router.replace('/(client)/training')
      }
    }

    checkAuth()
  }, [getIsAuthenticated])

  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
        </Stack>
      </SafeAreaView>
    </AuthProvider>
  )
}
