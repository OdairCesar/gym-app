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
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import * as Notifications from 'expo-notifications'
import { useAppTheme } from '@/hooks/useAppTheme'

import { useTrainings } from '@/hooks/useTrainings'
import { ExerciseItem } from '@/components/ExerciseItem'
import { useTrainingTimer } from '@/hooks/useTrainingTimer'
import { STORAGE_COMPLETED, STORAGE_SKIPPED } from '@/constants/storageKeys'
import '@/utils/notificationHandler'

import { Training } from '@/interfaces/Training'

type Filter = 'all' | 'completed' | 'skipped'

export default function TrainingExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { fetchTrainingById } = useTrainings()
  const router = useRouter()
  const navigation = useNavigation()
  const { styles: globalStyles, colors } = useAppTheme()

  const [training, setTraining] = useState<Training | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completedExercises, setCompletedExercises] = useState<number[]>([])
  const [skippedExercises, setSkippedExercises] = useState<number[]>([])
  const [filter, setFilter] = useState<Filter>('all')

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

    setCompletedExercises(completedRaw ? JSON.parse(completedRaw) : [])
    setSkippedExercises(skippedRaw ? JSON.parse(skippedRaw) : [])
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

  const elapsed = useTrainingTimer(pendingExercisesCount)
  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60

  useEffect(() => {
    if (exercisesToShow.length === 0)
      Notifications.cancelAllScheduledNotificationsAsync()
  }, [exercisesToShow])

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={styles.timerText}>
          Tempo de treino: {minutes.toString().padStart(2, '0')}:
          {seconds.toString().padStart(2, '0')}
        </Text>

        <View style={styles.filterContainer}>
          {(['all', 'completed', 'skipped'] as Filter[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterButton,
                filter === f && styles.filterButtonActive,
              ]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive,
                ]}
              >
                {f === 'all'
                  ? 'Todos'
                  : f === 'completed'
                    ? 'Concluídos'
                    : 'Pulados'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {exercisesToShow.length === 0 && (
          <View style={globalStyles.center}>
            <Text
              style={[
                globalStyles.text,
                { fontSize: 18, color: colors.success },
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
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#999',
    marginHorizontal: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  filterText: {
    color: '#444',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
})
