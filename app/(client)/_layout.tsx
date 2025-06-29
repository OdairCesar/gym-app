import React, { useEffect } from 'react'
import { Tabs, useRouter } from 'expo-router'
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'

import { AuthProvider, useAuth } from '@/context/authContext'

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
  const { getIsAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await getIsAuthenticated()

      if (!isAuth) {
        router.replace('/(auth)/login')
        return null
      }
    }

    checkAuth()
  }, [getIsAuthenticated])

  // Se estiver autenticado, renderiza a pilha de rotas normalmente
  return (
    <AuthProvider>
      <Tabs>
        <Tabs.Screen
          name="training"
          options={{
            headerShown: false,
            title: 'Treino',
            tabBarIcon: ({ color }) => (
              <TabBarIcon
                name="card-bulleted-outline"
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
                name="food-apple-outline"
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
                name="store"
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
    </AuthProvider>
  )
}
