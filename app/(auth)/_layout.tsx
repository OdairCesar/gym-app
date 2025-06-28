import { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'

import { AuthProvider, useAuth } from '@/context/authContext'

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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </AuthProvider>
  )
}
