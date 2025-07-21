import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useAppTheme } from '@/hooks/useAppTheme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTrainings } from '@/hooks/useTrainings'
import { ExerciseItem } from '@/components/ExerciseItem'
import { useTrainingState } from '@/hooks/useTrainingState'
import { STORAGE_COMPLETED, STORAGE_SKIPPED } from '@/constants/storageKeys'

import { Training } from '@/interfaces/Training'

type Filter = 'all' | 'completed' | 'skipped'

export default function TrainingExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { fetchTrainingById } = useTrainings()
  const router = useRouter()
  const navigation = useNavigation()
  const { styles: globalStyles, colors } = useAppTheme()
  const insets = useSafeAreaInsets()

  // Usa o novo sistema de controle de estado
  const { getElapsedTime, isInProgress, completeTraining, pauseTraining } =
    useTrainingState(id)

  const [training, setTraining] = useState<Training | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completedExercises, setCompletedExercises] = useState<number[]>([])
  const [skippedExercises, setSkippedExercises] = useState<number[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [elapsedTime, setElapsedTime] = useState(0)
  const [hasShownCompletionAlert, setHasShownCompletionAlert] = useState(false)

  // Atualiza o tempo decorrido a cada segundo se o treino estiver em progresso
  useEffect(() => {
    if (!isInProgress) return

    const interval = setInterval(() => {
      setElapsedTime(getElapsedTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [isInProgress, getElapsedTime])

  // Inicializa o tempo decorrido
  useEffect(() => {
    setElapsedTime(getElapsedTime())
  }, [getElapsedTime])

  // Funções de controle dos botões flutuantes
  const handlePauseTraining = async () => {
    try {
      await pauseTraining()
      router.back() // Volta para a lista de treinos
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao pausar o treino')
      console.error('Erro ao pausar treino:', error)
    }
  }

  const handleCompleteTraining = async () => {
    try {
      await completeTraining()
      Alert.alert(
        '🎉 Parabéns!',
        `Treino finalizado!\n\n✅ Exercícios concluídos: ${completedCount}\n⏭️ Exercícios pulados: ${skippedCount}\n⏱️ Tempo total: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
        [
          {
            text: 'OK',
            style: 'default',
            onPress: () => router.back(),
          },
        ],
      )
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao finalizar o treino')
      console.error('Erro ao finalizar treino:', error)
    }
  }

  const fetchTraining = useCallback(async () => {
    if (!id) {
      setLoading(false)
      router.replace('/(client)/training')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Busca o treino pelo ID usando a API
      const foundTraining = await fetchTrainingById(id)

      if (foundTraining) {
        setTraining(foundTraining)
      } else {
        setError('Treino não encontrado.')
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Erro desconhecido ao carregar o treino.')
      }
    } finally {
      setLoading(false)
    }

    // Carrega estado dos exercícios do AsyncStorage
    const completedRaw = await AsyncStorage.getItem(STORAGE_COMPLETED)
    const skippedRaw = await AsyncStorage.getItem(STORAGE_SKIPPED)

    // Se o treino foi resetado (está como not_started), limpa os dados dos exercícios
    const currentTrainingState = await AsyncStorage.getItem(
      `@training_state_${id}`,
    )
    const isResetTraining =
      !currentTrainingState ||
      JSON.parse(currentTrainingState || '{}').status === 'not_started'

    if (isResetTraining) {
      // Limpa os dados antigos se o treino foi resetado
      await AsyncStorage.removeItem(STORAGE_COMPLETED)
      await AsyncStorage.removeItem(STORAGE_SKIPPED)
      setCompletedExercises([])
      setSkippedExercises([])
    } else {
      // Carrega os dados normalmente se o treino está em progresso
      setCompletedExercises(completedRaw ? JSON.parse(completedRaw) : [])
      setSkippedExercises(skippedRaw ? JSON.parse(skippedRaw) : [])
    }
  }, [id, fetchTrainingById, router])

  useEffect(() => {
    if (id) fetchTraining()
  }, [id, fetchTraining])

  useFocusEffect(
    useCallback(() => {
      fetchTraining()
    }, [fetchTraining]),
  )

  useLayoutEffect(() => {
    if (training?.nome) navigation.setOptions({ title: training.nome })
  }, [training, navigation])

  const saveCompleted = async (list: number[]) => {
    setCompletedExercises(list)

    await AsyncStorage.setItem(STORAGE_COMPLETED, JSON.stringify(list))
  }

  const saveSkipped = async (list: number[]) => {
    setSkippedExercises(list)

    await AsyncStorage.setItem(STORAGE_SKIPPED, JSON.stringify(list))
  }

  const handleCompleteExercise = (index: number) => {
    if (completedExercises.includes(index)) return

    saveCompleted([...completedExercises, index])

    if (skippedExercises.includes(index)) {
      const filtered = skippedExercises.filter((i) => i !== index)

      saveSkipped(filtered)
    }
  }

  const handleSkipExercise = (index: number) => {
    if (skippedExercises.includes(index)) return

    saveSkipped([...skippedExercises, index])

    if (completedExercises.includes(index)) {
      const filtered = completedExercises.filter((i) => i !== index)

      saveCompleted(filtered)
    }
  }

  const orderedExercises = useMemo(() => {
    if (!training) return []

    return [...training.exercicios].sort((a, b) => a.ordem - b.ordem)
  }, [training])

  const exercisesToShow = useMemo(() => {
    switch (filter) {
      case 'completed':
        return orderedExercises.filter((_, i) => completedExercises.includes(i))
      case 'skipped':
        return orderedExercises.filter((_, i) => skippedExercises.includes(i))
      default:
        return orderedExercises.filter(
          (_, i) =>
            !completedExercises.includes(i) && !skippedExercises.includes(i),
        )
    }
  }, [filter, orderedExercises, completedExercises, skippedExercises])

  const pendingExercisesCount = useMemo(() => {
    if (!training) return 0

    return (
      training.exercicios.length -
      completedExercises.length -
      skippedExercises.length
    )
  }, [training, completedExercises, skippedExercises])

  // Reset da flag quando o treino é reiniciado ou há novos exercícios pendentes
  useEffect(() => {
    if (pendingExercisesCount > 0) {
      setHasShownCompletionAlert(false)
    }
  }, [pendingExercisesCount])

  const totalExercises = training?.exercicios.length || 0
  const completedCount = completedExercises.length
  const skippedCount = skippedExercises.length
  const progressPercentage =
    totalExercises > 0
      ? Math.round(((completedCount + skippedCount) / totalExercises) * 100)
      : 0

  // Usa o tempo do novo sistema de controle
  const minutes = Math.floor(elapsedTime / 60)
  const seconds = elapsedTime % 60

  const showCompletionAlert = useCallback(async () => {
    if (
      pendingExercisesCount === 0 &&
      totalExercises > 0 &&
      !hasShownCompletionAlert &&
      isInProgress
    ) {
      setHasShownCompletionAlert(true)

      // Finaliza o treino automaticamente quando todos exercícios forem feitos
      await completeTraining()

      Alert.alert(
        '🎉 Parabéns!',
        `Treino finalizado!\n\n✅ Exercícios concluídos: ${completedCount}\n⏭️ Exercícios pulados: ${skippedCount}\n⏱️ Tempo total: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
        [
          {
            text: 'OK',
            style: 'default',
            onPress: () => router.back(),
          },
        ],
      )
    }
  }, [
    pendingExercisesCount,
    totalExercises,
    hasShownCompletionAlert,
    isInProgress,
    completedCount,
    skippedCount,
    minutes,
    seconds,
    completeTraining,
    router,
  ])

  useEffect(() => {
    if (
      exercisesToShow.length === 0 &&
      filter === 'all' &&
      totalExercises > 0
    ) {
      const timer = setTimeout(showCompletionAlert, 500)
      return () => clearTimeout(timer)
    }
  }, [exercisesToShow.length, filter, totalExercises, showCompletionAlert])

  if (loading) {
    return (
      <View style={globalStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (error) {
    return (
      <View style={globalStyles.center}>
        <Text style={globalStyles.text}>Erro: {error}</Text>
      </View>
    )
  }

  if (!training) {
    return (
      <View style={globalStyles.center}>
        <Text style={globalStyles.text}>Treino não encontrado.</Text>
      </View>
    )
  }

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header com informações do treino */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <View
            style={[
              styles.statsCard,
              {
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {minutes.toString().padStart(2, '0')}:
                  {seconds.toString().padStart(2, '0')}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Tempo
                </Text>
              </View>

              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />

              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.success }]}>
                  {completedCount}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Concluídos
                </Text>
              </View>

              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />

              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.warning }]}>
                  {skippedCount}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Pulados
                </Text>
              </View>

              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />

              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  {pendingExercisesCount}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Restantes
                </Text>
              </View>
            </View>

            {/* Barra de progresso */}
            {totalExercises > 0 && (
              <View style={styles.progressSection}>
                <View
                  style={[
                    styles.progressBar,
                    { backgroundColor: colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: colors.primary,
                        width: `${progressPercentage}%`,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[styles.progressText, { color: colors.textSecondary }]}
                >
                  {progressPercentage}% completo (
                  {completedCount + skippedCount}/{totalExercises})
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Filtros com visual melhorado */}
        <View style={styles.filterContainer}>
          {(
            [
              { key: 'all', label: 'Todos', count: pendingExercisesCount },
              { key: 'completed', label: 'Concluídos', count: completedCount },
              { key: 'skipped', label: 'Pulados', count: skippedCount },
            ] as const
          ).map(({ key, label, count }) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.filterButton,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.backgroundSecondary,
                },
                filter === key && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => setFilter(key)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: colors.textSecondary },
                  filter === key && { color: '#fff' },
                ]}
              >
                {label}
              </Text>
              <View
                style={[
                  styles.filterBadge,
                  {
                    backgroundColor:
                      filter === key ? 'rgba(255,255,255,0.2)' : colors.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterBadgeText,
                    { color: filter === key ? '#fff' : colors.background },
                  ]}
                >
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Conteúdo dos exercícios */}
        <View style={styles.exercisesContainer}>
          {exercisesToShow.length === 0 && (
            <View style={[globalStyles.center, { paddingTop: 40 }]}>
              <Text
                style={[
                  globalStyles.text,
                  { fontSize: 18, color: colors.success, textAlign: 'center' },
                ]}
              >
                {filter === 'completed'
                  ? 'Não há exercícios concluídos!'
                  : filter === 'skipped'
                    ? 'Não há exercícios pulados!'
                    : 'Treino Finalizado! 🎉'}
              </Text>
            </View>
          )}

          {exercisesToShow.map((exercicio) => {
            const originalIndex = orderedExercises.indexOf(exercicio)

            return (
              <ExerciseItem
                key={exercicio.ordem}
                exercicio={exercicio}
                onComplete={() => handleCompleteExercise(originalIndex)}
                onSkip={() => handleSkipExercise(originalIndex)}
                disableComplete={filter === 'completed'}
                disableSkip={filter === 'skipped'}
              />
            )
          })}
        </View>
      </ScrollView>

      {/* Botões flutuantes - só aparecem se o treino estiver em progresso */}
      {isInProgress && (
        <View
          style={[
            styles.floatingButtonsContainer,
            { bottom: Math.max(insets.bottom + 20, 80) },
          ]}
        >
          <TouchableOpacity
            style={[styles.floatingButton, { backgroundColor: '#FF9800' }]}
            onPress={handlePauseTraining}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="pause" size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.floatingButton,
              { backgroundColor: '#F44336', marginTop: 14 },
            ]}
            onPress={handleCompleteTraining}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="stop" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  // Header e estatísticas
  header: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 8,
  },
  statsCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  divider: {
    width: 1,
    height: 30,
    marginHorizontal: 6,
  },
  progressSection: {
    marginTop: 14,
  },
  progressBar: {
    height: 5,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Timer (removido pois agora está no header)
  timerText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },

  // Filtros melhorados
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 14,
    paddingHorizontal: 14,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  filterText: {
    fontWeight: '600',
    fontSize: 12,
  },
  filterBadge: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Container dos exercícios
  exercisesContainer: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },

  // Botões flutuantes
  floatingButtonsContainer: {
    position: 'absolute',
    right: 16,
    zIndex: 1000,
  },
  floatingButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
})
