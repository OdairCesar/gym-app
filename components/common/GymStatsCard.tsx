import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useAppTheme } from '@/hooks/useAppTheme'
import { GymStats } from '@/interfaces/Gym'

interface GymStatsCardProps {
  stats: GymStats | null
  loading?: boolean
}

const statItems = [
  {
    key: 'totalUsers',
    label: 'Usuários',
    icon: 'account-group-outline' as const,
  },
  {
    key: 'activeUsers',
    label: 'Ativos',
    icon: 'account-check-outline' as const,
  },
  { key: 'totalTrainings', label: 'Treinos', icon: 'dumbbell' as const },
  { key: 'totalDiets', label: 'Dietas', icon: 'food-apple-outline' as const },
  {
    key: 'totalProducts',
    label: 'Produtos',
    icon: 'package-variant-closed' as const,
  },
]

function GymStatsCard({ stats, loading }: GymStatsCardProps) {
  const { colors } = useAppTheme()

  if (loading) {
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
        <ActivityIndicator color={colors.primary} />
      </View>
    )
  }

  if (!stats) return null

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
      <Text style={[styles.title, { color: colors.text }]}>
        Estatísticas da Academia
      </Text>
      <View style={styles.grid}>
        {statItems.map(({ key, label, icon }) => (
          <View
            key={key}
            style={[styles.statBox, { backgroundColor: colors.background }]}
          >
            <MaterialCommunityIcons
              name={icon}
              size={22}
              color={colors.primary}
              style={{ marginBottom: 4 }}
            />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {(stats as unknown as Record<string, number>)[key] ?? 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statBox: {
    width: '29%',
    minWidth: 80,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    flexGrow: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
})

export default React.memo(GymStatsCard)
