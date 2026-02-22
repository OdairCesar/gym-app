import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { useRouter, type Href } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppTheme } from '@/hooks/useAppTheme'

interface MenuItem {
  label: string
  description: string
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']
  route: Href
  color: string
}

export default function MaisScreen() {
  const router = useRouter()
  const { colors } = useAppTheme()

  const menuItems: MenuItem[] = [
    {
      label: 'Produtos',
      description: 'Gerenciar estoque e produtos da loja',
      icon: 'package-variant',
      route: '/(admin)/products',
      color: '#6C63FF',
    },
    {
      label: 'Academias',
      description: 'Gerenciar academias cadastradas',
      icon: 'home-city',
      route: '/(admin)/gyms',
      color: '#00B894',
    },
    {
      label: 'Permissões',
      description: 'Gerenciar permissões de usuários',
      icon: 'shield-account',
      route: '/(admin)/permissions',
      color: '#E17055',
    },
  ]

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.backgroundSecondary,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    content: {
      padding: 20,
      gap: 12,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
    },
    iconContainer: {
      width: 52,
      height: 52,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    menuInfo: {
      flex: 1,
    },
    menuLabel: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 3,
    },
    menuDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    chevron: {
      marginLeft: 8,
    },
  })

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mais</Text>
        <Text style={styles.headerSubtitle}>Configurações e gerenciamento</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => router.navigate(item.route)}
            activeOpacity={0.75}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: item.color + '20' },
              ]}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={28}
                color={item.color}
              />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={colors.textSecondary}
              style={styles.chevron}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
