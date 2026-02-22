import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
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

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}

function getRoleInfo(user: User): { label: string; color: string } {
  if (user.isAdmin) return { label: 'Administrador', color: '#FF453A' }
  if (user.isPersonal) return { label: 'Personal Trainer', color: '#32D74B' }
  return { label: 'Cliente', color: '#007AFF' }
}

function getGenderLabel(gender?: string): string | undefined {
  if (gender === 'M') return 'Masculino'
  if (gender === 'F') return 'Feminino'
  if (gender === 'O') return 'Outro'
  return undefined
}

export default function ProfileScreen({
  title,
}: ProfileScreenProps) {
  const { getUser, logout } = useAuthContext()
  const { fetchCurrentUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const { styles: gs, colors } = useAppTheme()
  const { isDark, setTheme } = useTheme()

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true)
      const cached = await getUser()
      if (cached) setUser(cached)
      const fresh = await fetchCurrentUser()
      if (fresh) setUser(fresh)
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
      <View style={gs.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[gs.text, { marginTop: 10 }]}>Carregando perfil...</Text>
      </View>
    )
  }

  if (!user) {
    return (
      <View style={gs.centered}>
        <Text style={gs.text}>Usuário não encontrado.</Text>
      </View>
    )
  }

  const role = getRoleInfo(user)
  const initials = getInitials(user.name)

  const s = StyleSheet.create({
    // Hero
    hero: {
      alignItems: 'center',
      paddingVertical: 28,
      paddingHorizontal: 20,
      backgroundColor: colors.backgroundSecondary,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 8,
      elevation: 4,
    },
    avatarWrapper: {
      position: 'relative',
      marginBottom: 14,
    },
    avatar: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: role.color,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: role.color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    },
    avatarText: {
      fontSize: 32,
      fontWeight: '700',
      color: '#fff',
      letterSpacing: 1,
    },
    statusDot: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: user.isActive ? '#32D74B' : '#FF453A',
      borderWidth: 2.5,
      borderColor: colors.backgroundSecondary,
    },
    heroName: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 4,
    },
    heroEmail: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    roleBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: role.color + '18',
      paddingHorizontal: 14,
      paddingVertical: 5,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: role.color + '40',
    },
    roleBadgeDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: role.color,
    },
    roleBadgeText: {
      fontSize: 13,
      fontWeight: '600',
      color: role.color,
    },
    // Seções
    section: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 16,
      marginHorizontal: 16,
      marginBottom: 14,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 6,
    },
    sectionHeaderText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    sectionBody: {
      paddingHorizontal: 16,
      paddingBottom: 4,
    },
    // Ações
    actionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginHorizontal: 16,
      marginBottom: 32,
    },
    actionBtn: {
      flex: 1,
      minWidth: '45%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderRadius: 14,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    actionBtnText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#fff',
    },
  })

  return (
    <ScrollView
      style={gs.container}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero ── */}
      <View style={s.hero}>
        <View style={s.avatarWrapper}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
          <View style={s.statusDot} />
        </View>
        <Text style={s.heroName}>{user.name}</Text>
        <Text style={s.heroEmail}>{user.email}</Text>
        <View style={s.roleBadge}>
          <View style={s.roleBadgeDot} />
          <Text style={s.roleBadgeText}>{role.label}</Text>
        </View>
      </View>

      {/* ── Informações Pessoais ── */}
      <View style={s.section}>
        <View style={s.sectionHeader}>
          <MaterialCommunityIcons
            name="account-outline"
            size={15}
            color={colors.textSecondary}
          />
          <Text style={s.sectionHeaderText}>Informações Pessoais</Text>
        </View>
        <View style={s.sectionBody}>
          <ProfileInfoRow
            icon="cake-variant-outline"
            label="Nascimento"
            value={
              user.birthDate
                ? formatDate(new Date(user.birthDate))
                : undefined
            }
          />
          <ProfileInfoRow
            icon={
              user.gender === 'F'
                ? 'gender-female'
                : user.gender === 'M'
                  ? 'gender-male'
                  : 'gender-non-binary'
            }
            label="Gênero"
            value={getGenderLabel(user.gender)}
          />
          <ProfileInfoRow
            icon="card-account-details-outline"
            label="CPF"
            value={user.cpf}
          />
          <ProfileInfoRow
            icon="briefcase-outline"
            label="Profissão"
            value={user.profession}
          />
        </View>
      </View>

      {/* ── Contato ── */}
      <View style={s.section}>
        <View style={s.sectionHeader}>
          <MaterialCommunityIcons
            name="phone-outline"
            size={15}
            color={colors.textSecondary}
          />
          <Text style={s.sectionHeaderText}>Contato</Text>
        </View>
        <View style={s.sectionBody}>
          <ProfileInfoRow
            icon="phone-outline"
            label="Telefone"
            value={user.phone}
          />
          <ProfileInfoRow
            icon="map-marker-outline"
            label="Endereço"
            value={user.address}
          />
        </View>
      </View>

      {/* ── Academia ── */}
      {user.gym && (
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <MaterialCommunityIcons
              name="domain"
              size={15}
              color={colors.textSecondary}
            />
            <Text style={s.sectionHeaderText}>Academia</Text>
          </View>
          <View style={s.sectionBody}>
            <ProfileInfoRow
              icon="domain"
              label="Nome"
              value={user.gym.name}
            />
            {user.gym.address !== undefined && (
              <ProfileInfoRow
                icon="map-marker-outline"
                label="Endereço"
                value={user.gym.address}
              />
            )}
            {user.gym.phone !== undefined && (
              <ProfileInfoRow
                icon="phone-outline"
                label="Telefone"
                value={user.gym.phone}
              />
            )}
            {user.gym.email !== undefined && (
              <ProfileInfoRow
                icon="email-outline"
                label="Email"
                value={user.gym.email}
              />
            )}
            {user.gym.cnpj !== undefined && (
              <ProfileInfoRow
                icon="file-document-outline"
                label="CNPJ"
                value={user.gym.cnpj}
              />
            )}
          </View>
        </View>
      )}

      {/* ── Ações ── */}
      <View style={s.actionsGrid}>
        <TouchableOpacity
          style={[s.actionBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/editProfile')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="account-edit" size={18} color="#fff" />
          <Text style={s.actionBtnText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.actionBtn, { backgroundColor: '#8E44AD' }]}
          onPress={() => router.push('/changePassword')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="lock-reset" size={18} color="#fff" />
          <Text style={s.actionBtnText}>Trocar Senha</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            s.actionBtn,
            { backgroundColor: isDark ? '#FF9500' : '#FF9500' },
          ]}
          onPress={() => setTheme(isDark ? 'light' : 'dark')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name={isDark ? 'weather-sunny' : 'weather-night'}
            size={18}
            color="#fff"
          />
          <Text style={s.actionBtnText}>
            {isDark ? 'Tema Claro' : 'Tema Escuro'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.actionBtn, { backgroundColor: colors.error }]}
          onPress={logout}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="logout" size={18} color="#fff" />
          <Text style={s.actionBtnText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
