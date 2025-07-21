import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ActivityIndicator, View } from 'react-native'

export default function IndexScreen() {
  const router = useRouter()

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken')
        const userData = await AsyncStorage.getItem('userData')

        if (token && userData) {
          const user = JSON.parse(userData)

          // Redirecionar baseado no tipo do usuário
          if (user.isAdmin) {
            router.replace('/(admin)/users')
          } else if (user.isPersonal) {
            router.replace('/(personal)/trainings')
          } else {
            router.replace('/(client)/training')
          }
        } else {
          router.replace('/(auth)/login')
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        router.replace('/(auth)/login')
      }
    }

    checkAuthAndRedirect()
  }, [router])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  )
}
