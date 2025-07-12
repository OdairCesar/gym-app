import React, { useState, useEffect, useCallback } from 'react'
import { View, FlatList, Alert, RefreshControl } from 'react-native'
import { useDiets } from '@/hooks/useDiets'
import { useUsers } from '@/hooks/useUsers'
import { IDiet, IMeal } from '@/interfaces/Diet'
import DietFormModal from '@/components/common/DietFormModal'
import AssignDietModal from '@/components/common/AssignDietModal'
import GenericFilterModal, {
  FilterField,
} from '@/components/common/GenericFilterModal'
import PageHeader, { HeaderButton } from '@/components/common/PageHeader'
import DietCard from '@/components/common/DietCard'
import { GlobalStyles, Colors } from '@/styles/globalStyles'

interface FilterState {
  nome: string
  criador: string
  calorias: string
}

export default function DietsScreen() {
  const {
    currentUser,
    clients,
    fetchCurrentUser,
    fetchClients,
    assignDietToClient,
  } = useUsers()
  const { diets, fetchDiets, createDiet, updateDiet, deleteDiet, filterDiets } =
    useDiets()

  const [filteredDiets, setFilteredDiets] = useState<IDiet[]>([])
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

  // Atualizar o criador quando o usuário atual for carregado
  useEffect(() => {
    if (currentUser && formData.criador === '') {
      setFormData((prev) => ({ ...prev, criador: currentUser._id || '' }))
    }
  }, [currentUser, formData.criador])

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
      criador: currentUser?._id || '',
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

  const applyFilters = useCallback(() => {
    const filtered = filterDiets(filters)
    setFilteredDiets(filtered)
    setFilterModalVisible(false)
  }, [filterDiets, filters])

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
      const dietData = { ...formData }
      const success = editingDiet
        ? await updateDiet(editingDiet._id!, dietData)
        : await createDiet(dietData)

      if (success) {
        setModalVisible(false)
        resetForm()
        // Aplicar filtros novamente após salvar
        const filtered = filterDiets(filters)
        setFilteredDiets(filtered)
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro inesperado')
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

  const handleDeleteDiet = async (dietId: string) => {
    Alert.alert('Confirmar', 'Tem certeza que deseja deletar esta dieta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: async () => {
          const success = await deleteDiet(dietId)
          if (success) {
            // Aplicar filtros novamente após deletar
            const filtered = filterDiets(filters)
            setFilteredDiets(filtered)
          }
        },
      },
    ])
  }

  const openAssignModal = (diet: IDiet) => {
    setSelectedDietForAssign(diet)
    setAssignModalVisible(true)
  }

  const handleAssignDiet = async (clientId: string) => {
    if (selectedDietForAssign?._id) {
      const success = await assignDietToClient(
        clientId,
        selectedDietForAssign._id,
      )
      if (success) {
        setAssignModalVisible(false)
        setSelectedDietForAssign(null)
      }
    }
  }

  useEffect(() => {
    fetchDiets()
    fetchCurrentUser()
    fetchClients()
  }, [fetchDiets, fetchCurrentUser, fetchClients])

  useEffect(() => {
    setFilteredDiets(diets)
    // Reaplica os filtros após carregar as dietas
    if (filters.nome || filters.criador || filters.calorias) {
      const filtered = filterDiets(filters)
      setFilteredDiets(filtered)
    }
  }, [diets, filterDiets, filters])

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      await Promise.all([fetchDiets(), fetchCurrentUser(), fetchClients()])
    } finally {
      setRefreshing(false)
    }
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
      placeholder: 'Minhas dietas...',
      value: filters.criador,
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
      color: Colors.primary,
    },
    {
      icon: 'plus',
      onPress: () => {
        resetForm()
        setModalVisible(true)
      },
      color: Colors.primary,
    },
  ]

  const renderDietItem = ({ item }: { item: IDiet }) => (
    <DietCard
      diet={item}
      personals={currentUser ? [currentUser] : []}
      onEdit={openEditModal}
      onDelete={handleDeleteDiet}
      onAssignToClient={openAssignModal}
    />
  )

  return (
    <View style={GlobalStyles.container}>
      <PageHeader title="Gerenciar Dietas" buttons={headerButtons} />

      <FlatList
        data={filteredDiets}
        keyExtractor={(item) => item._id || ''}
        renderItem={renderDietItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={GlobalStyles.list}
        showsVerticalScrollIndicator={false}
      />

      <DietFormModal
        visible={modalVisible}
        title={editingDiet ? 'Editar Dieta' : 'Nova Dieta'}
        formData={formData}
        currentMeal={currentMeal}
        mealModalVisible={mealModalVisible}
        currentFood={currentFood}
        personals={currentUser ? [currentUser] : []}
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
        onAssign={handleAssignDiet}
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
