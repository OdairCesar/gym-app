import React, { useState, useEffect, useCallback } from 'react'
import { View, FlatList, Alert, RefreshControl, StyleSheet } from 'react-native'
import { useAuth } from '@/context/authContext'
import { Training } from '@/interfaces/Training'
import { Exercise } from '@/interfaces/Exercise'
import { User } from '@/interfaces/User'
import { API_ENDPOINTS, buildApiUrl } from '@/constants/api'
import TrainingFormModal from '@/components/admin/TrainingFormModal'
import GenericFilterModal, {
  FilterField,
} from '@/components/common/GenericFilterModal'
import PageHeader, { HeaderButton } from '@/components/common/PageHeader'
import TrainingCard from '@/components/admin/TrainingCard'

interface FilterState {
  nome: string
  treinador: string
  user: string
}

export default function TrainingsScreen() {
  const { getToken } = useAuth()
  const [trainings, setTrainings] = useState<Training[]>([])
  const [filteredTrainings, setFilteredTrainings] = useState<Training[]>([])
  const [personals, setPersonals] = useState<User[]>([])
  const [clients, setClients] = useState<User[]>([])
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
      treinador: '',
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

  const fetchTrainings = useCallback(async () => {
    try {
      const token = await getToken()

      const response = await fetch(buildApiUrl(API_ENDPOINTS.TRAINING), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const json = await response.json()
        const trainingsData = json.data || json
        setTrainings(trainingsData)
        setFilteredTrainings(trainingsData)
      } else {
        Alert.alert('Erro', 'Falha ao carregar treinos')
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão')
    } finally {
      setRefreshing(false)
    }
  }, [getToken])

  const fetchPersonals = useCallback(async () => {
    try {
      const token = await getToken()

      const response = await fetch(
        buildApiUrl(`${API_ENDPOINTS.USER}?isPersonal=true`),
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (response.ok) {
        const json = await response.json()
        const personalsData = json.data || json
        setPersonals(personalsData)
      }
    } catch (error) {
      console.error('Erro ao carregar personais:', error)
    }
  }, [getToken])

  const fetchClients = useCallback(async () => {
    try {
      const token = await getToken()

      const response = await fetch(
        buildApiUrl(`${API_ENDPOINTS.USER}?isAdmin=false&isPersonal=false`),
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (response.ok) {
        const json = await response.json()
        const clientsData = json.data || json
        setClients(clientsData)
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
    }
  }, [getToken])

  const applyFilters = useCallback(() => {
    let filtered = [...trainings]

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((training) => {
          if (key === 'treinador') {
            // Filtrar por ID do personal
            return training.treinador === value
          } else if (key === 'user') {
            // Filtrar por ID do cliente
            return training.user === value
          } else {
            // Filtros normais (nome do treino)
            const trainingValue = training[key as keyof Training]
            return trainingValue
              ?.toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          }
        })
      }
    })

    setFilteredTrainings(filtered)
    setFilterModalVisible(false)
  }, [trainings, filters])

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
      const token = await getToken()
      const url = editingTraining
        ? buildApiUrl(`${API_ENDPOINTS.TRAINING}/${editingTraining._id}`)
        : buildApiUrl(API_ENDPOINTS.TRAINING)

      const method = editingTraining ? 'PUT' : 'POST'

      const trainingData = { ...formData }

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trainingData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        Alert.alert('Erro', errorData.message || 'Falha ao salvar treino')
        return
      }

      Alert.alert(
        'Sucesso',
        `Treino ${editingTraining ? 'atualizado' : 'criado'} com sucesso`,
      )
      setModalVisible(false)
      resetForm()
      fetchTrainings()
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão')
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

  const deleteTraining = async (trainingId: string) => {
    Alert.alert('Confirmar', 'Tem certeza que deseja deletar este treino?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await getToken()
            const response = await fetch(
              buildApiUrl(`${API_ENDPOINTS.TRAINING}/${trainingId}`),
              {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            )

            if (response.ok) {
              Alert.alert('Sucesso', 'Treino deletado com sucesso')
              fetchTrainings()
            } else {
              Alert.alert('Erro', 'Falha ao deletar treino')
            }
          } catch (error) {
            Alert.alert('Erro', 'Erro de conexão')
          }
        },
      },
    ])
  }

  useEffect(() => {
    fetchTrainings()
    fetchPersonals()
    fetchClients()
  }, [fetchTrainings, fetchPersonals, fetchClients])

  const onRefresh = () => {
    setRefreshing(true)
    fetchTrainings()
    fetchPersonals()
    fetchClients()
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
      placeholder: 'Todos os personals...',
      value: filters.treinador,
      options: personals.map((personal) => ({
        label: personal.nome,
        value: personal._id || '',
      })),
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
      color: '#007AFF',
    },
    {
      icon: 'plus',
      onPress: () => {
        resetForm()
        setModalVisible(true)
      },
      color: '#007AFF',
    },
  ]

  const renderTrainingItem = ({ item }: { item: Training }) => (
    <TrainingCard
      training={item}
      personals={personals}
      clients={clients}
      onEdit={openEditModal}
      onDelete={deleteTraining}
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
        personals={personals}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
})
