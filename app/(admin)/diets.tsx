import React, { useState, useEffect, useCallback } from 'react'
import { View, FlatList, Alert, RefreshControl, StyleSheet } from 'react-native'
import { useAuth } from '@/context/authContext'
import { IDiet, IMeal } from '@/interfaces/Diet'
import { User } from '@/interfaces/User'
import { API_ENDPOINTS, buildApiUrl } from '@/constants/api'
import DietFormModal from '@/components/admin/DietFormModal'
import AssignDietModal from '@/components/admin/AssignDietModal'
import GenericFilterModal, {
  FilterField,
} from '@/components/common/GenericFilterModal'
import PageHeader, { HeaderButton } from '@/components/common/PageHeader'
import DietCard from '@/components/admin/DietCard'

interface FilterState {
  nome: string
  criador: string
  calorias: string
}

export default function DietsScreen() {
  const { getToken } = useAuth()
  const [diets, setDiets] = useState<IDiet[]>([])
  const [filteredDiets, setFilteredDiets] = useState<IDiet[]>([])
  const [personals, setPersonals] = useState<User[]>([])
  const [clients, setClients] = useState<User[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [assignModalVisible, setAssignModalVisible] = useState(false)
  const [editingDiet, setEditingDiet] = useState<IDiet | null>(null)
  const [selectedDietForAssign, setSelectedDietForAssign] =
    useState<IDiet | null>(null)

  const [formData, setFormData] = useState<Partial<IDiet>>({
    nome: '',
    descricao: '',
    calorias: 0,
    proteinas: 0,
    carboidratos: 0,
    gorduras: 0,
    criador: '',
    refeicoes: [],
  })

  const [currentMeal, setCurrentMeal] = useState<IMeal>({
    nome: '',
    descricao: '',
    horario: '',
    alimentos: [],
  })

  const [mealModalVisible, setMealModalVisible] = useState(false)
  const [currentFood, setCurrentFood] = useState('')

  const [filters, setFilters] = useState<FilterState>({
    nome: '',
    criador: '',
    calorias: '',
  })

  const handleFormChange = (key: string, value: string | number) => {
    if (
      key === 'calorias' ||
      key === 'proteinas' ||
      key === 'carboidratos' ||
      key === 'gorduras'
    ) {
      const numValue =
        typeof value === 'string' ? parseFloat(value) || 0 : value
      setFormData({ ...formData, [key]: numValue })
    } else {
      setFormData({ ...formData, [key]: value })
    }
  }

  const handleMealChange = (key: string, value: string) => {
    setCurrentMeal({ ...currentMeal, [key]: value })
  }

  const handleFoodChange = (value: string) => {
    setCurrentFood(value)
  }

  const addFood = () => {
    if (!currentFood.trim()) {
      Alert.alert('Erro', 'Digite o nome do alimento')
      return
    }

    const updatedFoods = [...currentMeal.alimentos, currentFood.trim()]
    setCurrentMeal({ ...currentMeal, alimentos: updatedFoods })
    setCurrentFood('')
  }

  const removeFood = (index: number) => {
    const updatedFoods = currentMeal.alimentos.filter((_, i) => i !== index)
    setCurrentMeal({ ...currentMeal, alimentos: updatedFoods })
  }

  const addMeal = () => {
    if (!currentMeal.nome.trim()) {
      Alert.alert('Erro', 'Nome da refeição é obrigatório')
      return
    }

    if (currentMeal.alimentos.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos um alimento')
      return
    }

    const updatedMeals = [...(formData.refeicoes || []), currentMeal]
    setFormData({ ...formData, refeicoes: updatedMeals })

    // Reset do formulário de refeição
    setCurrentMeal({
      nome: '',
      descricao: '',
      horario: '',
      alimentos: [],
    })
    setCurrentFood('')
    setMealModalVisible(false)
  }

  const removeMeal = (index: number) => {
    const updatedMeals = formData.refeicoes?.filter((_, i) => i !== index) || []
    setFormData({ ...formData, refeicoes: updatedMeals })
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      calorias: 0,
      proteinas: 0,
      carboidratos: 0,
      gorduras: 0,
      criador: '',
      refeicoes: [],
    })
    setCurrentMeal({
      nome: '',
      descricao: '',
      horario: '',
      alimentos: [],
    })
    setCurrentFood('')
    setEditingDiet(null)
  }

  const fetchDiets = useCallback(async () => {
    try {
      const token = await getToken()

      const response = await fetch(buildApiUrl(API_ENDPOINTS.DIET), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const json = await response.json()
        const dietsData = json.data || json

        setDiets(dietsData)
        setFilteredDiets(dietsData)
      } else {
        Alert.alert('Erro', 'Falha ao carregar dietas')
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
      console.error('Erro ao carregar personals:', error)
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
    let filtered = [...diets]

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((diet) => {
          if (key === 'criador') {
            return diet.criador === value
          } else if (key === 'calorias') {
            const numValue = parseFloat(value)
            if (isNaN(numValue)) return true
            return (diet.calorias || 0) >= numValue
          } else {
            const dietValue = diet[key as keyof IDiet]
            return dietValue
              ?.toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          }
        })
      }
    })

    setFilteredDiets(filtered)
    setFilterModalVisible(false)
  }, [diets, filters])

  const clearFilters = () => {
    setFilters({
      nome: '',
      criador: '',
      calorias: '',
    })
    setFilteredDiets(diets)
  }

  const saveDiet = async () => {
    try {
      const token = await getToken()
      const url = editingDiet
        ? buildApiUrl(`${API_ENDPOINTS.DIET}/${editingDiet._id}`)
        : buildApiUrl(API_ENDPOINTS.DIET)

      const method = editingDiet ? 'PUT' : 'POST'

      const dietData = { ...formData }

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dietData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        Alert.alert('Erro', errorData.message || 'Falha ao salvar dieta')
        return
      }

      Alert.alert(
        'Sucesso',
        `Dieta ${editingDiet ? 'atualizada' : 'criada'} com sucesso`,
      )
      setModalVisible(false)
      resetForm()
      fetchDiets()
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão')
    }
  }

  const openEditModal = (diet: IDiet) => {
    setEditingDiet(diet)
    setFormData({
      nome: diet.nome,
      descricao: diet.descricao,
      calorias: diet.calorias,
      proteinas: diet.proteinas,
      carboidratos: diet.carboidratos,
      gorduras: diet.gorduras,
      criador: diet.criador,
      refeicoes: diet.refeicoes,
    })
    setModalVisible(true)
  }

  const deleteDiet = async (dietId: string) => {
    Alert.alert('Confirmar', 'Tem certeza que deseja deletar esta dieta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await getToken()
            const response = await fetch(
              buildApiUrl(`${API_ENDPOINTS.DIET}/${dietId}`),
              {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            )

            if (response.ok) {
              Alert.alert('Sucesso', 'Dieta deletada com sucesso')
              fetchDiets()
            } else {
              Alert.alert('Erro', 'Falha ao deletar dieta')
            }
          } catch (error) {
            Alert.alert('Erro', 'Erro de conexão')
          }
        },
      },
    ])
  }

  const openAssignModal = (diet: IDiet) => {
    setSelectedDietForAssign(diet)
    setAssignModalVisible(true)
  }

  const assignDietToClient = async (clientId: string) => {
    try {
      const token = await getToken()
      const response = await fetch(
        buildApiUrl(`${API_ENDPOINTS.USER}/${clientId}`),
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            diet_id: selectedDietForAssign?._id,
          }),
        },
      )

      if (response.ok) {
        Alert.alert('Sucesso', 'Dieta atribuída ao cliente com sucesso')
        setAssignModalVisible(false)
        setSelectedDietForAssign(null)
        fetchClients() // Atualizar lista de clientes
      } else {
        const errorData = await response.json()
        Alert.alert('Erro', errorData.message || 'Falha ao atribuir dieta')
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão')
    }
  }

  useEffect(() => {
    fetchDiets()
    fetchPersonals()
    fetchClients()
  }, [fetchDiets, fetchPersonals, fetchClients])

  const onRefresh = () => {
    setRefreshing(true)
    fetchDiets()
    fetchPersonals()
    fetchClients()
  }

  const dietFilterFields: FilterField[] = [
    {
      key: 'nome',
      label: 'Nome',
      type: 'text',
      placeholder: 'Filtrar por nome',
      value: filters.nome,
    },
    {
      key: 'criador',
      label: 'Criador (Personal)',
      type: 'select',
      placeholder: 'Todos os personals...',
      value: filters.criador,
      options: personals.map((personal) => ({
        label: personal.nome,
        value: personal._id || '',
      })),
    },
    {
      key: 'calorias',
      label: 'Calorias mínimas',
      type: 'text',
      placeholder: 'Ex: 1500',
      value: filters.calorias,
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

  const renderDietItem = ({ item }: { item: IDiet }) => (
    <DietCard
      diet={item}
      personals={personals}
      onEdit={openEditModal}
      onDelete={deleteDiet}
      onAssignToClient={openAssignModal}
    />
  )

  return (
    <View style={styles.container}>
      <PageHeader title="Gerenciar Dietas" buttons={headerButtons} />

      <FlatList
        data={filteredDiets}
        keyExtractor={(item) => item._id || ''}
        renderItem={renderDietItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <DietFormModal
        visible={modalVisible}
        title={editingDiet ? 'Editar Dieta' : 'Nova Dieta'}
        formData={formData}
        currentMeal={currentMeal}
        mealModalVisible={mealModalVisible}
        currentFood={currentFood}
        personals={personals}
        onClose={() => {
          setModalVisible(false)
          resetForm()
        }}
        onSave={saveDiet}
        onFormChange={handleFormChange}
        onMealChange={handleMealChange}
        onAddMeal={addMeal}
        onRemoveMeal={removeMeal}
        onOpenMealModal={() => setMealModalVisible(true)}
        onCloseMealModal={() => setMealModalVisible(false)}
        onFoodChange={handleFoodChange}
        onAddFood={addFood}
        onRemoveFood={removeFood}
      />

      <AssignDietModal
        visible={assignModalVisible}
        diet={selectedDietForAssign}
        clients={clients}
        onClose={() => {
          setAssignModalVisible(false)
          setSelectedDietForAssign(null)
        }}
        onAssign={assignDietToClient}
      />

      <GenericFilterModal
        visible={filterModalVisible}
        title="Filtrar Dietas"
        fields={dietFilterFields}
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
