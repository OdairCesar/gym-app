import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { User } from '@/interfaces/User'
import { useAppTheme } from '@/hooks/useAppTheme'
import { formatDate } from '@/utils/formatDate'

interface PendingUserCardProps {
  user: User
  onApprove: (userId: number) => void
  onReject: (userId: number) => void
  loading?: boolean
}

function PendingUserCard({
  user,
  onApprove,
  onReject,
  loading,
}: PendingUserCardProps) {
  const { colors } = useAppTheme()

  const handleApprove = () => {
    Alert.alert('Aprovar Usuário', `Deseja aprovar ${user.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Aprovar',
        style: 'default',
        onPress: () => onApprove(user.id),
      },
    ])
  }

  const handleReject = () => {
    Alert.alert(
      'Rejeitar Usuário',
      `Deseja rejeitar ${user.name}? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rejeitar',
          style: 'destructive',
          onPress: () => onReject(user.id),
        },
      ],
    )
  }

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
      borderLeftWidth: 4,
      borderLeftColor: colors.warning || '#f59e0b',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 10,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '30',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerInfo: { flex: 1 },
    name: { fontSize: 16, fontWeight: '600', color: colors.text },
    email: { fontSize: 13, color: colors.textSecondary },
    infoRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 12,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: colors.background,
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    chipText: { fontSize: 12, color: colors.textSecondary },
    actions: { flexDirection: 'row', gap: 8 },
    approveBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      backgroundColor: colors.success || '#22c55e',
      borderRadius: 8,
      paddingVertical: 10,
      opacity: loading ? 0.6 : 1,
    },
    rejectBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      backgroundColor: colors.error,
      borderRadius: 8,
      paddingVertical: 10,
      opacity: loading ? 0.6 : 1,
    },
    btnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
    pendingBadge: {
      alignSelf: 'flex-start',
      backgroundColor: '#f59e0b20',
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 2,
      marginBottom: 10,
    },
    pendingBadgeText: { fontSize: 11, color: '#f59e0b', fontWeight: '600' },
  })

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons
            name="account-clock"
            size={22}
            color={colors.primary}
          />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>

      <View style={styles.pendingBadge}>
        <Text style={styles.pendingBadgeText}>AGUARDANDO APROVAÇÃO</Text>
      </View>

      <View style={styles.infoRow}>
        {user.phone ? (
          <View style={styles.chip}>
            <MaterialCommunityIcons
              name="phone"
              size={12}
              color={colors.textSecondary}
            />
            <Text style={styles.chipText}>{user.phone}</Text>
          </View>
        ) : null}
        {user.gender ? (
          <View style={styles.chip}>
            <MaterialCommunityIcons
              name="gender-male-female"
              size={12}
              color={colors.textSecondary}
            />
            <Text style={styles.chipText}>{user.gender}</Text>
          </View>
        ) : null}
        {user.birthDate ? (
          <View style={styles.chip}>
            <MaterialCommunityIcons
              name="calendar"
              size={12}
              color={colors.textSecondary}
            />
            <Text style={styles.chipText}>
              {formatDate(new Date(user.birthDate))}
            </Text>
          </View>
        ) : null}
        {user.profession ? (
          <View style={styles.chip}>
            <MaterialCommunityIcons
              name="briefcase"
              size={12}
              color={colors.textSecondary}
            />
            <Text style={styles.chipText}>{user.profession}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.approveBtn}
          onPress={handleApprove}
          disabled={loading}
        >
          <MaterialCommunityIcons name="check-circle" size={16} color="#fff" />
          <Text style={styles.btnText}>Aprovar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectBtn}
          onPress={handleReject}
          disabled={loading}
        >
          <MaterialCommunityIcons name="close-circle" size={16} color="#fff" />
          <Text style={styles.btnText}>Rejeitar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default React.memo(PendingUserCard)
