import React, { useState, useEffect, useCallback } from 'react'
import { View, FlatList, Alert, RefreshControl, StyleSheet } from 'react-native'
import { useUsers } from '@/hooks/useUsers'
import { useTrainings } from '@/hooks/useTrainings'
import { Training } from '@/interfaces/Training'
import { Exercise } from '@/interfaces/Exercise'
import TrainingFormModal from '@/components/common/TrainingFormModal'
import GenericFilterModal, {
  FilterField,
} from '@/components/common/GenericFilterModal'
import PageHeader, { HeaderButton } from '@/components/common/PageHeader'
import TrainingCard from '@/components/common/TrainingCard'
import { useAppTheme } from '@/hooks/useAppTheme'

interface FilterState {
  nome: string
  treinador: string
  user: string
}

export default function TrainingsScreen() {
  const { clients, currentUser, fetchClients, fetchCurrentUser } = useUsers()
  const {
    trainings,
    fetchTrainings,
    createTraining,
    updateTraining,
    deleteTraining,
    filterTrainings,
  } = useTrainings()

  const { colors } = useAppTheme()

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    list: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
  })

  const [filteredTrainings, setFilteredTrainings] = useState<Training[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [editingTraining, setEditingTraining] = useState<Training | null>(null)

  const [formData, setFormData] = useState<Partial<Training>>({
    nome: '',
    user: '',
    treinador: '',
    exercicios: [],
  })

  // Atualizar o treinador quando o usuário atual for carregado
  useEffect(() => {
    if (currentUser && formData.treinador === '') {
      setFormData((prev) => ({ ...prev, treinador: currentUser._id || '' }))
    }
  }, [currentUser, formData.treinador])

  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    nome: '',
    series: '',
    tipo: 'musculacao',
    carga: 0,
    descanso: 60,
    ordem: 1,
    videoUrl: '',
  })

  const [exerciseModalVisible, setExerciseModalVisible] = useState(false)

  const [filters, setFilters] = useState<FilterState>({
    nome: '',
    treinador: '',
    user: '',
  })

  const handleFormChange = (key: string, value: string | boolean) => {
    if (key === 'add-exercise') {
      setExerciseModalVisible(true)
    } else {
      setFormData({ ...formData, [key]: value })
    }
  }

  const handleExerciseChange = (key: string, value: string | number) => {
    if (key === 'carga' || key === 'descanso') {
      setCurrentExercise({
        ...currentExercise,
        [key]: typeof value === 'string' ? parseInt(value) || 0 : value,
      })
    } else {
      setCurrentExercise({ ...currentExercise, [key]: value })
    }
  }

  const addExercise = () => {
    if (!currentExercise.nome.trim()) {
      Alert.alert('Erro', 'Nome do exercício é obrigatório')
      return
    }

    const newExercise: Exercise = {
      ...currentExercise,
      ordem: (formData.exercicios?.length || 0) + 1,
    }

    const updatedExercises = [...(formData.exercicios || []), newExercise]
    setFormData({ ...formData, exercicios: updatedExercises })

    // Reset do formulário de exercício
    setCurrentExercise({
      nome: '',
      series: '',
      tipo: 'musculacao',
      carga: 0,
      descanso: 60,
      ordem: 1,
      videoUrl: '',
    })
    setExerciseModalVisible(false)
  }

  const removeExercise = (index: number) => {
    const updatedExercises =
      formData.exercicios?.filter((_, i) => i !== index) || []
    // Reordenar os exercícios
    const reorderedExercises = updatedExercises.map((ex, i) => ({
      ...ex,
      ordem: i + 1,
    }))
    setFormData({ ...formData, exercicios: reorderedExercises })
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      user: '',
      treinador: currentUser?._id || '',
      exercicios: [],
    })
    setCurrentExercise({
      nome: '',
      series: '',
      tipo: 'musculacao',
      carga: 0,
      descanso: 60,
      ordem: 1,
      videoUrl: '',
    })
    setEditingTraining(null)
  }

  const applyFilters = useCallback(() => {
    const filtered = filterTrainings(filters)
    setFilteredTrainings(filtered)
    setFilterModalVisible(false)
  }, [filterTrainings, filters])

  const clearFilters = () => {
    setFilters({
      nome: '',
      treinador: '',
      user: '',
    })
    setFilteredTrainings(trainings)
  }

  const saveTraining = async () => {
    try {
      const trainingData = { ...formData }
      const success = editingTraining
        ? await updateTraining(editingTraining._id!, trainingData)
        : await createTraining(trainingData)

      if (success) {
        setModalVisible(false)
        resetForm()
        // Aplicar filtros novamente após salvar
        const filtered = filterTrainings(filters)
        setFilteredTrainings(filtered)
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro inesperado')
    }
  }

  const openEditModal = (training: Training) => {
    setEditingTraining(training)
    setFormData({
      nome: training.nome,
      user: training.user,
      treinador: training.treinador,
      exercicios: training.exercicios,
    })
    setModalVisible(true)
  }

  const handleDeleteTraining = async (trainingId: string) => {
    Alert.alert('Confirmar', 'Tem certeza que deseja deletar este treino?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: async () => {
          const success = await deleteTraining(trainingId)
          if (success) {
            // Aplicar filtros novamente após deletar
            const filtered = filterTrainings(filters)
            setFilteredTrainings(filtered)
          }
        },
      },
    ])
  }

  useEffect(() => {
    fetchTrainings()
    fetchCurrentUser()
    fetchClients()
  }, [fetchTrainings, fetchCurrentUser, fetchClients])

  useEffect(() => {
    setFilteredTrainings(trainings)
    // Reaplica os filtros após carregar os treinamentos
    if (filters.nome || filters.treinador || filters.user) {
      const filtered = filterTrainings(filters)
      setFilteredTrainings(filtered)
    }
  }, [trainings, filterTrainings, filters])

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      await Promise.all([fetchTrainings(), fetchCurrentUser(), fetchClients()])
    } finally {
      setRefreshing(false)
    }
  }

  const trainingFilterFields: FilterField[] = [
    {
      key: 'nome',
      label: 'Nome',
      type: 'text',
      placeholder: 'Filtrar por nome',
      value: filters.nome,
    },
    {
      key: 'treinador',
      label: 'Personal Trainer',
      type: 'select',
      placeholder: 'Meus treinos...',
      value: filters.treinador,
      options: currentUser
        ? [
            {
              label: currentUser.nome,
              value: currentUser._id || '',
            },
          ]
        : [],
    },
    {
      key: 'user',
      label: 'Cliente',
      type: 'select',
      placeholder: 'Todos os clientes...',
      value: filters.user,
      options: clients.map((client) => ({
        label: client.nome,
        value: client._id || '',
      })),
    },
  ]

  const headerButtons: HeaderButton[] = [
    {
      icon: 'filter',
      onPress: () => setFilterModalVisible(true),
      color: colors.primary,
    },
    {
      icon: 'plus',
      onPress: () => {
        resetForm()
        setModalVisible(true)
      },
      color: colors.primary,
    },
  ]

  const renderTrainingItem = ({ item }: { item: Training }) => (
    <TrainingCard
      training={item}
      personals={currentUser ? [currentUser] : []}
      clients={clients}
      onEdit={openEditModal}
      onDelete={handleDeleteTraining}
    />
  )

  return (
    <View style={styles.container}>
      <PageHeader title="Gerenciar Treinos" buttons={headerButtons} />

      <FlatList
        data={filteredTrainings}
        keyExtractor={(item) => item._id || ''}
        renderItem={renderTrainingItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <TrainingFormModal
        visible={modalVisible}
        title={editingTraining ? 'Editar Treino' : 'Novo Treino'}
        formData={formData}
        currentExercise={currentExercise}
        exerciseModalVisible={exerciseModalVisible}
        clients={clients}
        personals={currentUser ? [currentUser] : []}
        onClose={() => {
          setModalVisible(false)
          resetForm()
        }}
        onSave={saveTraining}
        onFormChange={handleFormChange}
        onExerciseChange={handleExerciseChange}
        onAddExercise={addExercise}
        onRemoveExercise={removeExercise}
        onOpenExerciseModal={() => setExerciseModalVisible(true)}
        onCloseExerciseModal={() => setExerciseModalVisible(false)}
      />

      <GenericFilterModal
        visible={filterModalVisible}
        title="Filtrar Treinos"
        fields={trainingFilterFields}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        onFilterChange={handleFilterChange}
      />
    </View>
  )
}
