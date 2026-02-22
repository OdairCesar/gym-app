import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native'
import { useRouter } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useAppTheme } from '@/hooks/useAppTheme'
import { useAuth } from '@/context/authContext'
import { useTrainings } from '@/hooks/useTrainings'
import { useTrainingState } from '@/hooks/useTrainingState'
import { Training } from '@/interfaces/Training'

// ---------- StatusBadge ----------
function StatusBadge({ status }: { status: string }) {
  const { colors } = useAppTheme()

  const map: Record<string, { label: string; color: string }> = {
    not_started: { label: 'NÃ£o iniciado', color: colors.textSecondary },
    in_progress: { label: 'Em progresso', color: colors.warning },
    paused: { label: 'Pausado', color: '#FF9800' },
    completed: { label: 'ConcluÃ­do', color: colors.success },
  }

  const info = map[status] ?? { label: status, color: colors.textSecondary }

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: info.color + '22', borderColor: info.color },
      ]}
    >
      <Text style={[styles.badgeText, { color: info.color }]}>
        {info.label}
      </Text>
    </View>
  )
}

// ---------- TrainingCard (com controle de status isolado por treino) ----------
function TrainingCard({
  training,
  onStart,
}: {
  training: Training
  onStart: (id: number) => void
}) {
  const { colors } = useAppTheme()
  const { trainingState, startTraining, resumeTraining, resetTraining } =
    useTrainingState(training.id.toString())

  const status = trainingState?.status ?? 'not_started'

  const buttonColor =
    status === 'completed'
      ? colors.success
      : status === 'in_progress' || status === 'paused'
        ? colors.warning
        : colors.primary

  const buttonLabel =
    status === 'completed'
      ? 'Reiniciar Treino'
      : status === 'in_progress'
        ? 'Continuar Treino'
        : status === 'paused'
          ? 'Retomar Treino'
          : 'Iniciar Treino'

  const buttonIcon: React.ComponentProps<
    typeof MaterialCommunityIcons
  >['name'] =
    status === 'completed'
      ? 'restart'
      : status === 'in_progress' || status === 'paused'
        ? 'play'
        : 'play-circle-outline'

  const handlePress = async () => {
    if (status === 'completed') {
      Alert.alert(
        'Treino ConcluÃ­do',
        'Este treino jÃ¡ foi concluÃ­do. Deseja reiniciÃ¡-lo?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Reiniciar',
            onPress: async () => {
              await resetTraining()
              onStart(training.id)
            },
          },
        ],
      )
      return
    }

    if (status === 'not_started') {
      await startTraining()
    } else if (status === 'paused') {
      await resumeTraining() // retoma sem resetar o timer
    }
    // in_progress: apenas navega, sem alterar o estado

    onStart(training.id)
  }

  return (
    <View
      style={[
        styles.trainingCard,
        {
          backgroundColor: colors.backgroundSecondary,
          borderColor: colors.border,
        },
      ]}
    >
      {/* CabeÃ§alho */}
      <View style={styles.trainingHeader}>
        <MaterialCommunityIcons
          name="dumbbell"
          size={28}
          color={colors.primary}
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.trainingName, { color: colors.text }]}>
            {training.name}
          </Text>
          {training.description ? (
            <Text
              style={[styles.trainingDesc, { color: colors.textSecondary }]}
            >
              {training.description}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Status badge */}
      <StatusBadge status={status} />

      {/* EstatÃ­sticas */}

      {/* BotÃ£o de aÃ§Ã£o */}
      <TouchableOpacity
        style={[styles.startButton, { backgroundColor: buttonColor }]}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name={buttonIcon} size={22} color="#fff" />
        <Text style={styles.startButtonText}>{buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  )
}

// ---------- Tela principal ----------
export default function TrainingScreen() {
  const router = useRouter()
  const { styles: globalStyles, colors } = useAppTheme()
  const { getUser } = useAuth()
  const { fetchTrainingById, fetchUserTrainings } = useTrainings()

  const [trainings, setTrainings] = useState<Training[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadTrainings = useCallback(async () => {
    const u = await getUser()
    if (!u?.id) {
      setLoading(false)
      return
    }

    try {
      setError(null)

      // Tenta buscar todos os treinos vinculados ao userId
      const userTrainings = await fetchUserTrainings(u.id)

      if (userTrainings.length > 0) {
        // Busca detalhes de cada treino (para obter exercÃ­cios embutidos, se disponÃ­veis)
        const detailed = await Promise.all(
          userTrainings.map((t) => fetchTrainingById(t.id)),
        )
        setTrainings(detailed.filter(Boolean) as Training[])
      } else if (u.trainingId) {
        // Fallback: treino Ãºnico vinculado diretamente ao usuÃ¡rio
        const t = await fetchTrainingById(u.trainingId)
        if (t) setTrainings([t])
        else setTrainings([])
      } else {
        setTrainings([])
      }
    } catch {
      setError('Erro ao carregar treinos.')
    } finally {
      setLoading(false)
    }
  }, [getUser, fetchUserTrainings, fetchTrainingById])

  useEffect(() => {
    loadTrainings()
  }, [loadTrainings])

  const onRefresh = async () => {
    setRefreshing(true)
    await loadTrainings()
    setRefreshing(false)
  }

  const handleStartTraining = (id: number) => {
    router.push({
      pathname: '/trainingExercise',
      params: { id: id.toString() },
    })
  }

  if (loading) {
    return (
      <View style={globalStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (trainings.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={globalStyles.center}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <MaterialCommunityIcons
          name="dumbbell"
          size={64}
          color={colors.textSecondary}
          style={{ marginBottom: 16 }}
        />
        <Text
          style={[
            globalStyles.text,
            { textAlign: 'center', opacity: 0.7, fontSize: 16 },
          ]}
        >
          {error ?? 'Nenhum treino atribuÃ­do.\nConsulte seu treinador.'}
        </Text>
      </ScrollView>
    )
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {trainings.map((training) => (
        <TrainingCard
          key={training.id}
          training={training}
          onStart={handleStartTraining}
        />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 48,
    gap: 16,
  },
  trainingCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  trainingHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  trainingName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  trainingDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 14,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 10,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
})
