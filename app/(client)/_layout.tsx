import React, { useEffect } from 'react'
import { Tabs, useRouter } from 'expo-router'
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'

import { AuthProvider, useAuth } from '@/context/authContext'
import { useAppTheme } from '@/hooks/useAppTheme'
import { SafeAreaView } from 'react-native-safe-area-context'

function TabBarIcon(props: {
  name: React.ComponentProps<
    typeof FontAwesome5 | typeof MaterialCommunityIcons
  >['name']
  color: string
  type: 'font-awesome' | 'material-community'
}) {
  if (props.type === 'material-community') {
    return (
      <MaterialCommunityIcons
        size={28}
        style={{ marginBottom: -3 }}
        {...props}
      />
    )
  }

  if (props.type === 'font-awesome') {
    return <FontAwesome5 size={28} style={{ marginBottom: -3 }} {...props} />
  }
}

export default function ClientLayoutNav() {
  const { getIsAuthenticated, isAdmin, isPersonal } = useAuth()
  const { colors } = useAppTheme()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await getIsAuthenticated()
      const userIsAdmin = await isAdmin()
      const userIsPersonal = await isPersonal()

      if (!isAuth) {
        router.replace('/(auth)/login')
        return null
      }

      if (!userIsAdmin && !userIsPersonal) return

      if (!userIsPersonal) {
        router.replace('/(admin)/trainings')
        return
      }

      router.replace('/(personal)/trainings')
    }

    checkAuth()
  }, [getIsAuthenticated, isAdmin, isPersonal, router])

  // Se estiver autenticado, renderiza a pilha de rotas normalmente
  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <Tabs
          initialRouteName="training"
          screenOptions={{
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarStyle: {
              backgroundColor: colors.backgroundSecondary,
              borderTopWidth: 0,
              elevation: 0,
              shadowOpacity: 0,
            },
          }}
        >
          <Tabs.Screen
            name="training"
            options={{
              headerShown: false,
              title: 'Treino',
              tabBarIcon: ({ color }) => (
                <TabBarIcon
                  name="dumbbell"
                  color={color}
                  type="material-community"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="diet"
            options={{
              headerShown: false,
              title: 'Dieta',
              tabBarIcon: ({ color }) => (
                <TabBarIcon
                  name="food-apple"
                  color={color}
                  type="material-community"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="store"
            options={{
              headerShown: false,
              title: 'Loja',
              tabBarIcon: ({ color }) => (
                <TabBarIcon
                  name="package-variant"
                  color={color}
                  type="material-community"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="perfil"
            options={{
              headerShown: false,
              title: 'Perfil',
              tabBarIcon: ({ color }) => (
                <TabBarIcon
                  name="account"
                  color={color}
                  type="material-community"
                />
              ),
            }}
          />
        </Tabs>
      </SafeAreaView>
    </AuthProvider>
  )
}
