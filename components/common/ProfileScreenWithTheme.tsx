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
import ThemeToggle from '@/components/ThemeToggle'

interface ProfileScreenProps {
  title?: string
}

export default function ProfileScreenWithTheme({
  title = 'Perfil do Cliente',
}: ProfileScreenProps) {
  const { getUser, logout } = useAuthContext()
  const { fetchCurrentUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  // Usando o hook do tema
  const { colors, styles } = useAppTheme()

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

  const handleLogout = async () => {
    await logout()
    router.replace('/login')
  }

  const handleEditProfile = () => {
    router.push('/editProfile')
  }

  const handleChangePassword = () => {
    router.push('/changePassword')
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.text, { marginTop: 16 }]}>Carregando...</Text>
      </View>
    )
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.text}>Usuário não encontrado</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={fetchUser}>
          <Text style={styles.primaryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.containerWithPadding}>
        <Text style={styles.pageTitle}>{title}</Text>

        {/* Seção de Controle de Tema */}
        <ThemeToggle />

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.titleMedium}>Informações Pessoais</Text>
            <TouchableOpacity onPress={handleEditProfile}>
              <MaterialCommunityIcons
                name="pencil"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.marginVertical}>
            <ProfileInfoRow label="Nome" value={user.nome} />
            <ProfileInfoRow label="Email" value={user.email} />
            <ProfileInfoRow
              label="Telefone"
              value={user.telefone || 'Não informado'}
            />
            <ProfileInfoRow
              label="Data de Nascimento"
              value={
                user.dataNascimento
                  ? formatDate(user.dataNascimento)
                  : 'Não informado'
              }
            />
            <ProfileInfoRow label="CPF" value={user.cpf || 'Não informado'} />
            <ProfileInfoRow label="Sexo" value={user.sexo || 'Não informado'} />
            <ProfileInfoRow
              label="Profissão"
              value={user.profissao || 'Não informado'}
            />
            <ProfileInfoRow
              label="Endereço"
              value={user.endereco || 'Não informado'}
            />
            <ProfileInfoRow
              label="Tipo de Usuário"
              value={
                user.isAdmin
                  ? 'Administrador'
                  : user.isPersonal
                    ? 'Personal'
                    : 'Cliente'
              }
            />
            <ProfileInfoRow
              label="Status"
              value={user.isActive ? 'Ativo' : 'Inativo'}
            />
          </View>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleEditProfile}
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
            onPress={handleChangePassword}
          >
            <MaterialCommunityIcons
              name="lock-reset"
              size={20}
              color={colors.textLight}
            />
            <Text style={styles.secondaryButtonText}>Alterar Senha</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dangerButton} onPress={handleLogout}>
            <MaterialCommunityIcons
              name="logout"
              size={20}
              color={colors.textLight}
            />
            <Text style={styles.dangerButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
