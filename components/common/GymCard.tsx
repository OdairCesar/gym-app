import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useAppTheme } from '@/hooks/useAppTheme'
import { Gym } from '@/interfaces/Gym'

interface GymCardProps {
  gym: Gym
  onEdit: (gym: Gym) => void
  onDelete: (gymId: number) => void
  onViewStats?: (gym: Gym) => void
}

function GymCard({
  gym,
  onEdit,
  onDelete,
  onViewStats,
}: GymCardProps) {
  const { colors } = useAppTheme()

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.backgroundSecondary,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons
            name="dumbbell"
            size={22}
            color={colors.primary}
          />
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {gym.name}
          </Text>
        </View>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: gym.published
                ? colors.success + '22'
                : colors.danger + '22',
              borderColor: gym.published ? colors.success : colors.danger,
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: gym.published ? colors.success : colors.danger },
            ]}
          >
            {gym.published ? 'Ativo' : 'Inativo'}
          </Text>
        </View>
      </View>

      {gym.address ? (
        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={14}
            color={colors.textSecondary}
          />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {gym.address}
          </Text>
        </View>
      ) : null}

      {gym.phone ? (
        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name="phone-outline"
            size={14}
            color={colors.textSecondary}
          />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {gym.phone}
          </Text>
        </View>
      ) : null}

      {gym.email ? (
        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name="email-outline"
            size={14}
            color={colors.textSecondary}
          />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {gym.email}
          </Text>
        </View>
      ) : null}

      {gym.description ? (
        <Text
          style={[styles.description, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {gym.description}
        </Text>
      ) : null}

      <View style={styles.actions}>
        {onViewStats && (
          <TouchableOpacity
            style={[
              styles.actionBtn,
              {
                backgroundColor: colors.primary + '15',
                borderColor: colors.primary,
              },
            ]}
            onPress={() => onViewStats(gym)}
          >
            <MaterialCommunityIcons
              name="chart-bar"
              size={16}
              color={colors.primary}
            />
            <Text style={[styles.actionText, { color: colors.primary }]}>
              Estatísticas
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.actionBtn,
            {
              backgroundColor: colors.primaryButtonLight,
              borderColor: colors.primary,
            },
          ]}
          onPress={() => onEdit(gym)}
        >
          <MaterialCommunityIcons
            name="pencil-outline"
            size={16}
            color={colors.primary}
          />
          <Text style={[styles.actionText, { color: colors.primary }]}>
            Editar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionBtn,
            { backgroundColor: colors.dangerLight, borderColor: colors.danger },
          ]}
          onPress={() => onDelete(gym.id)}
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={16}
            color={colors.danger}
          />
          <Text style={[styles.actionText, { color: colors.danger }]}>
            Excluir
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
})

export default React.memo(GymCard)
