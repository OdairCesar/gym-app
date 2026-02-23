import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  FlatList,
  Alert,
  RefreshControl,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTrainings } from '@/hooks/useTrainings'
import { useExercises } from '@/hooks/useExercises'
import { useUsers } from '@/hooks/useUsers'
import { Training } from '@/interfaces/Training'
import { Exercise } from '@/interfaces/Exercise'
import TrainingFormModal from '@/components/common/TrainingFormModal'
import ExerciseFormModal from '@/components/common/ExerciseFormModal'
import ExerciseList from '@/components/common/ExerciseList'
import { toast } from '@/utils/toast'
import GenericFilterModal, {
  FilterField,
} from '@/components/common/GenericFilterModal'
import PageHeader, { HeaderButton } from '@/components/common/PageHeader'
import TrainingCard from '@/components/common/TrainingCard'
import { useAppTheme } from '@/hooks/useAppTheme'

interface FilterState {
  name: string
  userId: string
  coachId: string
}

export default function TrainingsScreen() {
  const {
    trainings,
    fetchTrainings,
    fetchTrainingsFiltered,
    fetchTrainingById,
    createTraining,
    updateTraining,
    deleteTraining,
    filterTrainings,
  } = useTrainings()

  const { clients, personals, fetchClients, fetchPersonals } = useUsers()

  const {
    trainingExercises,
    setTrainingExercises,
    fetchTrainingExercises,
    createExercise,
    updateExercise,
    deleteExercise,
    addExerciseToTraining,
    removeExerciseFromTraining,
  } = useExercises()

  const { styles: globalStyles, colors } = useAppTheme()

  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const [isFormModalVisible, setIsFormModalVisible] = useState(false)
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)
  const [isExerciseModalVisible, setIsExerciseModalVisible] = useState(false)

  const [editingTraining, setEditingTraining] = useState<Training | null>(null)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(
    null,
  )

  const [formData, setFormData] = useState<Partial<Training>>({
    name: '',
    description: '',
  })
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    name: '',
    userId: '',
    coachId: '',
  })

  const refreshTrainingExercises = useCallback(
    async (trainingId: number) => {
      const detail = await fetchTrainingById(trainingId)
      if (detail?.exercises && detail.exercises.length > 0) {
        setTrainingExercises(detail.exercises)
      } else {
        await fetchTrainingExercises(trainingId)
      }
    },
    [fetchTrainingById, setTrainingExercises, fetchTrainingExercises],
  )

  const loadTrainings = useCallback(async () => {
    setLoading(true)
    try {
      await fetchTrainings()
    } finally {
      setLoading(false)
    }
  }, [fetchTrainings])

  useEffect(() => {
    loadTrainings()
    fetchClients()
    fetchPersonals()
  }, [loadTrainings, fetchClients, fetchPersonals])

  const onRefresh = async () => {
    setRefreshing(true)
    await loadTrainings()
    if (selectedTraining) await refreshTrainingExercises(selectedTraining.id)
    setRefreshing(false)
  }

  const openCreateModal = () => {
    setEditingTraining(null)
    setFormData({ name: '', description: '' })
    setSelectedUserId(null)
    setIsFormModalVisible(true)
  }

  const openEditModal = (training: Training) => {
    setEditingTraining(training)
    setFormData({ name: training.name, description: training.description })
    setSelectedUserId(training.userId ?? null)
    setIsFormModalVisible(true)
  }

  const saveTraining = async () => {
    if (!formData.name?.trim()) {
      toast.info('Atenção', 'O nome do treino é obrigatório.')
      return
    }
    try {
      const payload = {
        ...formData,
        ...(selectedUserId != null ? { userId: selectedUserId } : {}),
      }
      if (editingTraining) {
        await updateTraining(editingTraining.id, payload)
      } else {
        await createTraining(payload)
      }
      setIsFormModalVisible(false)
      await loadTrainings()
    } catch (err) {
      toast.error('Erro', 'Não foi possível salvar o treino.')
    }
  }

  const handleDeleteTraining = (trainingId: number) => {
    Alert.alert('Confirmar exclusão', 'Deseja excluir este treino?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTraining(trainingId)
            if (selectedTraining?.id === trainingId) setSelectedTraining(null)
            await loadTrainings()
          } catch {
            toast.error('Erro', 'Não foi possível excluir o treino.')
          }
        },
      },
    ])
  }

  const handleViewExercises = async (training: Training) => {
    setTrainingExercises([])
    setSelectedTraining(training)
    await refreshTrainingExercises(training.id)
  }

  const handleAddExercise = async (data: Partial<Exercise>) => {
    if (!selectedTraining) return
    try {
      const created = await createExercise(data)
      if (created) {
        await addExerciseToTraining(selectedTraining.id, created.id)
        await refreshTrainingExercises(selectedTraining.id)
      }
    } catch {
      toast.error('Erro', 'Não foi possível adicionar o exercício.')
    }
    setIsExerciseModalVisible(false)
    setEditingExercise(null)
  }

  const handleEditExercise = async (data: Partial<Exercise>) => {
    if (!editingExercise || !selectedTraining) return
    try {
      await updateExercise(editingExercise.id, data)
      await refreshTrainingExercises(selectedTraining.id)
    } catch {
      toast.error('Erro', 'Não foi possível editar o exercício.')
    }
    setIsExerciseModalVisible(false)
    setEditingExercise(null)
  }

  const handleRemoveExercise = async (exerciseId: number) => {
    if (!selectedTraining) return
    Alert.alert(
      'Remover exercício',
      'Deseja remover este exercício do treino?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeExerciseFromTraining(selectedTraining.id, exerciseId)
              await refreshTrainingExercises(selectedTraining.id)
            } catch {
              toast.error('Erro', 'Não foi possível remover o exercício.')
            }
          },
        },
      ],
    )
  }

  const applyFilters = async () => {
    setIsFilterModalVisible(false)
    const params: { userId?: number; coachId?: number; name?: string } = {}
    if (filters.name.trim()) params.name = filters.name.trim()
    if (filters.userId) params.userId = Number(filters.userId)
    if (filters.coachId) params.coachId = Number(filters.coachId)
    if (Object.keys(params).length > 0) {
      await fetchTrainingsFiltered(params)
    } else {
      await fetchTrainings()
    }
  }

  const clearFilters = async () => {
    setFilters({ name: '', userId: '', coachId: '' })
    await fetchTrainings()
  }

  const headerButtons: HeaderButton[] = [
    {
      icon: 'filter-outline',
      onPress: () => setIsFilterModalVisible(true),
    },
    {
      icon: 'plus',
      onPress: openCreateModal,
    },
  ]

  const filterFields: FilterField[] = [
    {
      key: 'name',
      label: 'Nome',
      type: 'text',
      placeholder: 'Filtrar por nome...',
      value: filters.name,
    },
    {
      key: 'userId',
      label: 'Aluno',
      type: 'select',
      placeholder: 'Todos os alunos',
      value: filters.userId,
      options: clients.map((c) => ({ label: c.name, value: String(c.id) })),
    },
    {
      key: 'coachId',
      label: 'Personal Trainer',
      type: 'select',
      placeholder: 'Todos os personals',
      value: filters.coachId,
      options: personals.map((p) => ({ label: p.name, value: String(p.id) })),
    },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <PageHeader title="Treinos" buttons={headerButtons} />

      <FlatList
        data={trainings}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TrainingCard
            training={item}
            onEdit={() => openEditModal(item)}
            onDelete={() => handleDeleteTraining(item.id)}
            onViewExercises={() => handleViewExercises(item)}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <Text style={[globalStyles.text, styles.emptyText]}>
              Nenhum treino encontrado.
            </Text>
          ) : null
        }
      />

      {/* Painel de exercícios do treino selecionado */}
      {selectedTraining && (
        <Modal
          visible={!!selectedTraining}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setSelectedTraining(null)}
        >
          <SafeAreaView
            style={{ flex: 1, backgroundColor: colors.background }}
            edges={['top']}
          >
            {/* Header igual ao TrainingFormModal */}
            <View
              style={[
                localStyles.modalHeader,
                {
                  backgroundColor: colors.backgroundSecondary,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <TouchableOpacity onPress={() => setSelectedTraining(null)}>
                <Text
                  style={[localStyles.headerSideBtn, { color: colors.error }]}
                >
                  Fechar
                </Text>
              </TouchableOpacity>
              <View style={localStyles.headerTitleWrapper}>
                <Text
                  style={[localStyles.headerTitle, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {selectedTraining.name}
                </Text>
                <Text
                  style={[
                    localStyles.headerSubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  {trainingExercises.length}{' '}
                  {trainingExercises.length === 1 ? 'exercício' : 'exercícios'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setEditingExercise(null)
                  setIsExerciseModalVisible(true)
                }}
              >
                <Text
                  style={[
                    localStyles.headerSideBtn,
                    { color: colors.primary, textAlign: 'right' },
                  ]}
                >
                  + Adicionar
                </Text>
              </TouchableOpacity>
            </View>

            <ExerciseList
              exercises={trainingExercises}
              onAdd={() => {
                setEditingExercise(null)
                setIsExerciseModalVisible(true)
              }}
              onEdit={(exercise) => {
                setEditingExercise(exercise)
                setIsExerciseModalVisible(true)
              }}
              onRemove={handleRemoveExercise}
            />
          </SafeAreaView>
        </Modal>
      )}

      <TrainingFormModal
        visible={isFormModalVisible}
        title={editingTraining ? 'Editar Treino' : 'Novo Treino'}
        formData={formData}
        onClose={() => setIsFormModalVisible(false)}
        onSave={saveTraining}
        onFormChange={(field, value) =>
          setFormData((prev) => ({ ...prev, [field]: value }))
        }
        users={clients.map((c) => ({ id: c.id, name: c.name }))}
        selectedUserId={selectedUserId}
        onUserChange={setSelectedUserId}
      />

      <ExerciseFormModal
        visible={isExerciseModalVisible}
        title={editingExercise ? 'Editar Exercício' : 'Novo Exercício'}
        initialData={editingExercise || undefined}
        onClose={() => {
          setIsExerciseModalVisible(false)
          setEditingExercise(null)
        }}
        onSave={editingExercise ? handleEditExercise : handleAddExercise}
      />

      <GenericFilterModal
        visible={isFilterModalVisible}
        title="Filtrar Treinos"
        fields={filterFields}
        onClose={() => setIsFilterModalVisible(false)}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        onFilterChange={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    opacity: 0.6,
  },
})

const localStyles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitleWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  headerSideBtn: {
    fontSize: 15,
    fontWeight: '500',
    minWidth: 72,
  },
})
