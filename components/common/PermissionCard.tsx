import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { GymPermission, UserPermission } from '@/interfaces/Permission'
import { useAppTheme } from '@/hooks/useAppTheme'

// ─── GymPermissionCard ───────────────────────────────────────────────────────

interface GymPermissionCardProps {
  permission: GymPermission
  onEdit?: (permission: GymPermission) => void
  onDelete: (id: number) => void
}

export const GymPermissionCard = React.memo(function GymPermissionCard({
  permission,
  onEdit,
  onDelete,
}: GymPermissionCardProps) {
  const { colors } = useAppTheme()

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: 16,
      marginVertical: 4,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      flexDirection: 'row',
      alignItems: 'center',
    },
    info: { flex: 1 },
    title: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    detail: { fontSize: 13, color: colors.textSecondary, marginBottom: 2 },
    badge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.primary + '20',
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 2,
      marginTop: 4,
    },
    badgeText: { fontSize: 12, color: colors.primary, fontWeight: '600' },
    actions: { flexDirection: 'row', gap: 8 },
    actionBtn: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.background,
    },
  })

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.title}>Academia ID: {permission.gymId}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{permission.action}</Text>
        </View>
        <Text style={[styles.detail, { marginTop: 4 }]}>
          Recurso: {permission.resource}
        </Text>
      </View>
      <View style={styles.actions}>
        {onEdit && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onEdit(permission)}
          >
            <MaterialCommunityIcons
              name="pencil"
              size={18}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onDelete(permission.id)}
        >
          <MaterialCommunityIcons
            name="delete"
            size={18}
            color={colors.error}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
})

// ─── UserPermissionCard ──────────────────────────────────────────────────────

interface UserPermissionCardProps {
  permission: UserPermission
  onEdit?: (permission: UserPermission) => void
  onDelete: (id: number) => void
}

export const UserPermissionCard = React.memo(function UserPermissionCard({
  permission,
  onEdit,
  onDelete,
}: UserPermissionCardProps) {
  const { colors } = useAppTheme()

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: 16,
      marginVertical: 4,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      flexDirection: 'row',
      alignItems: 'center',
    },
    info: { flex: 1 },
    title: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    detail: { fontSize: 13, color: colors.textSecondary, marginBottom: 2 },
    badge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.success + '20',
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 2,
      marginTop: 4,
    },
    badgeText: { fontSize: 12, color: colors.success, fontWeight: '600' },
    actions: { flexDirection: 'row', gap: 8 },
    actionBtn: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.background,
    },
  })

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.title}>Usuário ID: {permission.userId}</Text>
        <Text style={styles.detail}>Concedido a: {permission.grantedById}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{permission.action}</Text>
        </View>
        <Text style={[styles.detail, { marginTop: 4 }]}>
          Recurso: {permission.resource}
          {permission.resourceId != null
            ? ` (ID: ${permission.resourceId})`
            : ''}
        </Text>
      </View>
      <View style={styles.actions}>
        {onEdit && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onEdit(permission)}
          >
            <MaterialCommunityIcons
              name="pencil"
              size={18}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onDelete(permission.id)}
        >
          <MaterialCommunityIcons
            name="delete"
            size={18}
            color={colors.error}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
})
