import { useCallback, useState, useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useTrainings } from '@/hooks/useTrainings'
import { useUsers } from '@/hooks/useUsers'
import { useAppTheme } from '@/hooks/useAppTheme'
import { useTrainingState } from '@/hooks/useTrainingState'
import { Training } from '@/interfaces/Training'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { STORAGE_COMPLETED, STORAGE_SKIPPED } from '@/constants/storageKeys'

export default function TrainingScreen() {
  const { fetchUserTraining, loading } = useTrainings()
  const { fetchPersonals, getPersonalName } = useUsers()
  const { colors } = useAppTheme()
  const [userTrainings, setUserTrainings] = useState<Training[]>([])
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  const TrainingControlButton = ({ trainingId }: { trainingId: string }) => {
    const {
      startTraining,
      pauseTraining,
      resumeTraining,
      completeTraining,
      resetTraining,
      isNotStarted,
      isInProgress,
      isPaused,
      isCompleted,
    } = useTrainingState(trainingId)

    const handleStartTraining = async () => {
      try {
        await startTraining()
        router.push({
          pathname: '/trainingExercise',
          params: { id: trainingId },
        })
      } catch (error) {
        Alert.alert('Erro', 'Ocorreu um erro ao iniciar o treino')
        console.error('Erro ao iniciar treino:', error)
      }
    }

    const handlePauseTraining = async () => {
      try {
        await pauseTraining()
      } catch (error) {
        Alert.alert('Erro', 'Ocorreu um erro ao pausar o treino')
        console.error('Erro ao pausar treino:', error)
      }
    }

    const handleCompleteTraining = async () => {
      try {
        await completeTraining()
      } catch (error) {
        Alert.alert('Erro', 'Ocorreu um erro ao finalizar o treino')
        console.error('Erro ao finalizar treino:', error)
      }
    }

    const handleResumeTraining = async () => {
      try {
        await resumeTraining()
        router.push({
          pathname: '/trainingExercise',
          params: { id: trainingId },
        })
      } catch (error) {
        Alert.alert('Erro', 'Ocorreu um erro ao continuar o treino')
        console.error('Erro ao continuar treino:', error)
      }
    }

    const handleResetTraining = async () => {
      try {
        // Limpa o estado dos exercícios concluídos e pulados
        await AsyncStorage.removeItem(STORAGE_COMPLETED)
        await AsyncStorage.removeItem(STORAGE_SKIPPED)

        // Reseta o estado do treino
        await resetTraining()

        // Inicia um novo treino
        await startTraining()

        router.push({
          pathname: '/trainingExercise',
          params: { id: trainingId },
        })
      } catch (error) {
        Alert.alert('Erro', 'Ocorreu um erro ao refazer o treino')
        console.error('Erro ao refazer treino:', error)
      }
    }

    // Treino não iniciado - botão único "Iniciar"
    if (isNotStarted) {
      return (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={handleStartTraining}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="play" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Iniciar Treino</Text>
        </TouchableOpacity>
      )
    }

    // Treino em progresso - botões "Pausar" e "Finalizar"
    if (isInProgress) {
      return (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.halfButton, { backgroundColor: '#FF9800' }]}
            onPress={handlePauseTraining}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="pause" size={18} color="#fff" />
            <Text style={styles.halfButtonText}>Pausar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.halfButton,
              { backgroundColor: '#F44336', marginLeft: 8 },
            ]}
            onPress={handleCompleteTraining}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="stop" size={18} color="#fff" />
            <Text style={styles.halfButtonText}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      )
    }

    // Treino pausado - botão "Continuar"
    if (isPaused) {
      return (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
          onPress={handleResumeTraining}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="play-pause" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Continuar Treino</Text>
        </TouchableOpacity>
      )
    }

    // Treino concluído - botão "Refazer"
    if (isCompleted) {
      return (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={handleResetTraining}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="refresh" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Refazer Treino</Text>
        </TouchableOpacity>
      )
    }

    return null
  }

  const loadUserTrainings = useCallback(async () => {
    try {
      setError(null)
      // Carrega os personals primeiro para ter os nomes disponíveis
      await fetchPersonals()

      const result = await fetchUserTraining()
      if (result) {
        // Se result for um array, usa diretamente, senão coloca em array
        setUserTrainings(Array.isArray(result) ? result : [result])
      } else {
        setUserTrainings([])
      }
    } catch (err) {
      console.error('Erro ao carregar treinos:', err)
      setError('Erro ao carregar treinos')
    }
  }, [fetchUserTraining, fetchPersonals])

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    await loadUserTrainings()
    setRefreshing(false)
  }, [loadUserTrainings])

  // Carregamento inicial apenas uma vez
  useEffect(() => {
    loadUserTrainings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 8, color: colors.text }}>
          Carregando treinos...
        </Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <MaterialCommunityIcons
          name="dumbbell"
          size={48}
          color={colors.error}
        />
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        <TouchableOpacity
          onPress={loadUserTrainings}
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (userTrainings.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <View style={styles.emptyStateContainer}>
          <MaterialCommunityIcons
            name="dumbbell"
            size={64}
            color={colors.textSecondary}
            style={styles.emptyIcon}
          />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Nenhum treino encontrado
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Solicite ao seu personal trainer para criar um treino personalizado
          </Text>
          <TouchableOpacity
            onPress={handleRefresh}
            style={[styles.refreshButton, { backgroundColor: colors.primary }]}
          >
            <MaterialCommunityIcons name="refresh" size={20} color="#fff" />
            <Text style={styles.refreshButtonText}>Atualizar</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        data={userTrainings}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.trainingCard,
              {
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
              },
            ]}
            onPress={() =>
              router.push({
                pathname: '/trainingExercise',
                params: { id: item._id },
              })
            }
            activeOpacity={0.7}
          >
            {/* Header do card */}
            <View style={styles.cardHeader}>
              <View style={styles.trainingIconContainer}>
                <MaterialCommunityIcons
                  name="dumbbell"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <View style={styles.trainingInfo}>
                <Text style={[styles.trainingName, { color: colors.text }]}>
                  {item.nome}
                </Text>
                <Text style={[styles.trainerName, { color: colors.primary }]}>
                  Coach: {getPersonalName(item.treinador)}
                </Text>
              </View>
              <View style={styles.trainingBadge}>
                <Text
                  style={[styles.trainingNumber, { color: colors.background }]}
                >
                  #{index + 1}
                </Text>
              </View>
            </View>

            {/* Detalhes do treino */}
            <View style={styles.trainingDetails}>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons
                  name="calendar-plus"
                  size={14}
                  color={colors.textSecondary}
                />
                <Text
                  style={[styles.detailText, { color: colors.textSecondary }]}
                >
                  Criado: {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <MaterialCommunityIcons
                  name="calendar-edit"
                  size={14}
                  color={colors.textSecondary}
                />
                <Text
                  style={[styles.detailText, { color: colors.textSecondary }]}
                >
                  Atualizado:{' '}
                  {new Date(item.updatedAt).toLocaleDateString('pt-BR')}
                </Text>
              </View>

              {item.exercicios && (
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons
                    name="format-list-numbered"
                    size={14}
                    color={colors.textSecondary}
                  />
                  <Text
                    style={[styles.detailText, { color: colors.textSecondary }]}
                  >
                    {item.exercicios.length} exercício
                    {item.exercicios.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              )}
            </View>

            {/* Botão de ação */}
            <View style={styles.cardFooter}>
              <TrainingControlButton trainingId={item._id} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 12,
  },

  // Empty state
  emptyStateContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyIcon: {
    marginBottom: 10,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    gap: 6,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Training cards
  trainingCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  // Card header
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  trainingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(33,150,243,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  trainingInfo: {
    flex: 1,
  },
  trainingName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
    lineHeight: 20,
  },
  trainerName: {
    fontSize: 12,
    fontWeight: '500',
  },
  trainingBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trainingNumber: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },

  // Training details
  trainingDetails: {
    marginBottom: 14,
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Card footer
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 10,
    gap: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Botões duplos para pausar/finalizar
  buttonRow: {
    flexDirection: 'row',
  },
  halfButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 10,
    gap: 5,
  },
  halfButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Error states
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },

  // Legacy styles (manter para compatibilidade)
  card: {
    padding: 14,
    gap: 6,
    marginBottom: 12,
    borderRadius: 6,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 12,
  },
  info: {
    position: 'absolute',
    right: 8,
    top: 4,
    fontSize: 9,
    marginTop: 6,
    textAlign: 'right',
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
})
