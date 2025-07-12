import React, { useEffect } from 'react'
import { Tabs, useRouter } from 'expo-router'
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'

import { AuthProvider, useAuth } from '@/context/authContext'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/styles/globalStyles'

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

export default function AdminLayoutNav() {
  const { getIsAuthenticated, isAdmin, isPersonal } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await getIsAuthenticated()
      const userIsAdmin = await isAdmin()
      const userIsPersonal = await isPersonal()

      if (!isAuth) {
        router.replace('/(auth)/login')
        return
      }

      if (userIsAdmin) return

      if (!userIsPersonal) {
        router.replace('/(client)/training')
        return
      }

      router.replace('/(personal)/trainings')
    }

    checkAuth()
  }, [getIsAuthenticated, isAdmin, isPersonal, router])

  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: '#8E8E93',
            tabBarStyle: {
              backgroundColor: '#F2F2F7',
              borderTopWidth: 0,
              elevation: 0,
              shadowOpacity: 0,
            },
          }}
        >
          <Tabs.Screen
            name="users"
            options={{
              headerShown: false,
              title: 'Usuários',
              tabBarIcon: ({ color }) => (
                <TabBarIcon
                  name="account-group"
                  color={color}
                  type="material-community"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="trainings"
            options={{
              headerShown: false,
              title: 'Treinos',
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
            name="diets"
            options={{
              headerShown: false,
              title: 'Dietas',
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
            name="products"
            options={{
              headerShown: false,
              title: 'Produtos',
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
