import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { User } from '@/interfaces/User'
import { useAppTheme } from '@/hooks/useAppTheme'

interface UserCardProps {
  user: User
  onEdit: (user: User) => void
  onDelete: (userId: number) => void
}

function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  const { colors } = useAppTheme()

  // A API retorna `role` e `approved` — isAdmin/isPersonal não existem no GET
  const isAdmin = user.role === 'admin' || user.role === 'super'
  const isPersonal = user.role === 'personal'
  const isActive = user.approved == null ? true : Boolean(user.approved)

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: 16,
      marginVertical: 4,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      flexDirection: 'row',
      alignItems: 'center',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    userTags: {
      flexDirection: 'row',
      gap: 6,
      marginTop: 8,
    },
    tag: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      fontSize: 12,
      fontWeight: '500',
    },
    tagError: {
      backgroundColor: colors.dangerLight,
      color: colors.danger,
    },
    tagPrimary: {
      backgroundColor: colors.primaryLight,
      color: colors.primary,
    },
    tagSecondary: {
      backgroundColor: colors.borderLight,
      color: colors.textSecondary,
    },
    actionButtonGroup: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.background,
    },
  })

  return (
    <View style={styles.card}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <View style={styles.userTags}>
          {isAdmin && <Text style={[styles.tag, styles.tagPrimary]}>Admin</Text>}
          {isPersonal && (
            <Text style={[styles.tag, styles.tagPrimary]}>Personal</Text>
          )}
          {!isAdmin && !isPersonal && (
            <Text style={[styles.tag, styles.tagPrimary]}>Aluno</Text>
          )}
          {!isActive && (
            <Text
              style={[
                styles.tag,
                {
                  backgroundColor: colors.dangerLight,
                  color: colors.danger,
                },
              ]}
            >
              Inativo
            </Text>
          )}
        </View>
      </View>
      <View style={styles.actionButtonGroup}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(user)}
        >
          <MaterialCommunityIcons
            name="pencil"
            size={20}
            color={colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete(user.id)}
        >
          <MaterialCommunityIcons
            name="delete"
            size={20}
            color={colors.danger}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default React.memo(UserCard)
