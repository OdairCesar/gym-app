import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { useEffect, useState, useCallback } from 'react'
import { useAuth as useAuthContext } from '@/context/authContext'
import { useAuth } from '@/hooks/useAuth'
import { User } from '@/interfaces/User'
import { useRouter } from 'expo-router'
import { ProfileInfoRow } from '@/components/ProfileInfoRow'
import { formatDate } from '@/utils/formatDate'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function ProfileScreen() {
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
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Carregando perfil...</Text>
      </View>
    )
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>Usuário não encontrado.</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Perfil do Cliente</Text>

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

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/editProfile')}
        >
          <MaterialCommunityIcons name="account-edit" size={22} color="white" />
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondary]}
          onPress={() => router.push('/changePassword')}
        >
          <MaterialCommunityIcons name="lock-reset" size={22} color="white" />
          <Text style={styles.buttonText}>Trocar Senha</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.danger]}
          onPress={logout}
        >
          <MaterialCommunityIcons name="logout" size={22} color="white" />
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 30,
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  secondary: {
    backgroundColor: '#6c757d',
  },
  danger: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})
