import { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'

import { AuthProvider, useAuth } from '@/context/authContext'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function AuthLayoutNav() {
  const { getIsAuthenticated, isAdmin, isPersonal } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await getIsAuthenticated()

      if (isAuth) {
        const userIsAdmin = await isAdmin()
        const userIsPersonal = await isPersonal()

        if (userIsAdmin) {
          router.replace('/(admin)/users')
        } else if (userIsPersonal) {
          router.replace('/(personal)/trainings')
        } else {
          router.replace('/(client)/training')
        }
      }
    }

    checkAuth()
  }, [getIsAuthenticated, isAdmin, isPersonal, router])

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
