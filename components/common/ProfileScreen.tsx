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
import { GlobalStyles, Colors } from '@/styles/globalStyles'

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
      <View style={GlobalStyles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={[GlobalStyles.text, { marginTop: 10 }]}>
          Carregando perfil...
        </Text>
      </View>
    )
  }

  if (!user) {
    return (
      <View style={GlobalStyles.centered}>
        <Text style={GlobalStyles.text}>Usuário não encontrado.</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={GlobalStyles.containerWithPadding}>
      <Text style={GlobalStyles.pageTitle}>{title}</Text>

      <View style={GlobalStyles.card}>
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

      <View style={GlobalStyles.actionButtonsContainer}>
        <TouchableOpacity
          style={GlobalStyles.primaryButton}
          onPress={() => router.push('/editProfile')}
        >
          <MaterialCommunityIcons
            name="account-edit"
            size={20}
            color={Colors.textLight}
          />
          <Text style={GlobalStyles.primaryButtonText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={GlobalStyles.secondaryButton}
          onPress={() => router.push('/changePassword')}
        >
          <MaterialCommunityIcons
            name="lock-reset"
            size={20}
            color={Colors.textLight}
          />
          <Text style={GlobalStyles.secondaryButtonText}>Trocar Senha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={GlobalStyles.dangerButton} onPress={logout}>
          <MaterialCommunityIcons
            name="logout"
            size={20}
            color={Colors.textLight}
          />
          <Text style={GlobalStyles.dangerButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
