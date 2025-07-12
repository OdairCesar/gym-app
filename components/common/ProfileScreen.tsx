import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { useAuth as useAuthContext } from '@/context/authContext'
import { useAuth } from '@/hooks/useAuth'
import { User } from '@/interfaces/User'
import { useRouter } from 'expo-router'
import { ProfileInfoRow } from '@/components/ProfileInfoRow'
import { formatDate } from '@/utils/formatDate'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useAppTheme } from '@/hooks/useAppTheme'
import { useTheme } from '@/context/themeContext'

interface ProfileScreenProps {
  title?: string
}

export default function ProfileScreen({
  title = 'Perfil do Cliente',
}: ProfileScreenProps) {
  const { getUser, logout } = useAuthContext()
  const { fetchCurrentUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const { styles, colors } = useAppTheme()
  const { isDark, setTheme } = useTheme()
  const handleToggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true)

      // Primeiro tenta pegar do storage local
      let currentUser = await getUser()

      if (!currentUser) {
        // Se não tiver no storage, busca da API
        currentUser = await fetchCurrentUser()
      }

      if (currentUser) {
        setUser(currentUser)
      }
    } catch (err) {
      console.error('Erro ao carregar usuário:', err)
    } finally {
      setLoading(false)
    }
  }, [getUser, fetchCurrentUser])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.text, { marginTop: 10 }]}>
          Carregando perfil...
        </Text>
      </View>
    )
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Usuário não encontrado.</Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>{title}</Text>

      <View style={styles.card}>
        <ProfileInfoRow label="Nome" value={user.nome} />
        <ProfileInfoRow label="Telefone" value={user.telefone} />
        <ProfileInfoRow label="Gênero" value={user.sexo} />
        <ProfileInfoRow
          label="Nascimento"
          value={user.dataNascimento ? formatDate(user.dataNascimento) : 'N/A'}
        />
        <ProfileInfoRow label="Email" value={user.email} />
        <ProfileInfoRow label="CPF" value={user.cpf} />
        <ProfileInfoRow label="Profissão" value={user.profissao} />
        <ProfileInfoRow label="Endereço" value={user.endereco} />
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/editProfile')}
        >
          <MaterialCommunityIcons
            name="account-edit"
            size={20}
            color={colors.textLight}
          />
          <Text style={styles.primaryButtonText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/changePassword')}
        >
          <MaterialCommunityIcons
            name="lock-reset"
            size={20}
            color={colors.textLight}
          />
          <Text style={styles.secondaryButtonText}>Trocar Senha</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.themeButton}
          onPress={handleToggleTheme}
        >
          <MaterialCommunityIcons
            name={isDark ? 'weather-sunny' : 'weather-night'}
            size={20}
            color={colors.textLight}
          />
          <Text style={styles.themeButtonText}>
            {isDark ? 'Tema Claro' : 'Tema Escuro'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dangerButton} onPress={logout}>
          <MaterialCommunityIcons
            name="logout"
            size={20}
            color={colors.textLight}
          />
          <Text style={styles.dangerButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
