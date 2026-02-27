import React, { useState, useEffect } from 'react'
import {
  View,
  FlatList,
  Alert,
  RefreshControl,
  StyleSheet,
} from 'react-native'
import { useUsers } from '@/hooks/useUsers'
import { useDiets } from '@/hooks/useDiets'
import { Diet } from '@/interfaces/Diet'
import { toast } from '@/utils/toast'
import DietFormModal from '@/components/common/DietFormModal'
import MealsManagementModal from '@/components/common/MealsManagementModal'
import AssignDietModal from '@/components/common/AssignDietModal'
import GenericFilterModal, {
  FilterField,
} from '@/components/common/GenericFilterModal'
import PageHeader, { HeaderButton } from '@/components/common/PageHeader'
import DietCard from '@/components/common/DietCard'
import { useAppTheme } from '@/hooks/useAppTheme'

interface FilterState {
  name: string
  calories: string
  userId: string
  creatorId: string
}

export default function DietsScreen() {
  const { clients, fetchClients, personals, fetchPersonals, assignDietToClient } = useUsers()
  const { diets, fetchDiets, fetchDietsFiltered, createDiet, updateDiet, deleteDiet } =
    useDiets()
  const { colors } = useAppTheme()

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    list: { flex: 1, paddingHorizontal: 16, paddingVertical: 8 },
  })

  const [filteredDiets, setFilteredDiets] = useState<Diet[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [assignModalVisible, setAssignModalVisible] = useState(false)
  const [editingDiet, setEditingDiet] = useState<Diet | null>(null)
  const [selectedDietForAssign, setSelectedDietForAssign] = useState<Diet | null>(null)

  // Meals management
  const [mealsModalVisible, setMealsModalVisible] = useState(false)
  const [selectedDiet, setSelectedDiet] = useState<Diet | null>(null)

  const [formData, setFormData] = useState<Partial<Diet>>({
    name: '',
    description: '',
    calories: 0,
    proteins: 0,
    carbohydrates: 0,
    fats: 0,
  })

  const [filters, setFilters] = useState<FilterState>({
    name: '',
    calories: '',
    userId: '',
    creatorId: '',
  })

  const handleFormChange = (key: string, value: string | number) => {
    if (['calories', 'proteins', 'carbohydrates', 'fats'].includes(key)) {
      const numValue =
        typeof value === 'string' ? parseFloat(value) || 0 : value
      setFormData({ ...formData, [key]: numValue })
    } else {
      setFormData({ ...formData, [key]: value })
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      calories: 0,
      proteins: 0,
      carbohydrates: 0,
      fats: 0,
    })
    setEditingDiet(null)
  }

  const applyFilters = async () => {
    setFilterModalVisible(false)
    const params: { userId?: number; creatorId?: number; name?: string } = {}
    if (filters.name.trim()) params.name = filters.name.trim()
    if (filters.userId) params.userId = Number(filters.userId)
    if (filters.creatorId) params.creatorId = Number(filters.creatorId)
    if (Object.keys(params).length > 0) {
      await fetchDietsFiltered(params)
    } else {
      await fetchDiets()
    }
  }

  const clearFilters = async () => {
    setFilters({ name: '', calories: '', userId: '', creatorId: '' })
    await fetchDiets()
  }

  const saveDiet = async () => {
    try {
      const success = editingDiet
        ? await updateDiet(editingDiet.id, formData)
        : await createDiet(formData)

      if (success) {
        setModalVisible(false)
        resetForm()
        setFilteredDiets(diets)
      }
    } catch (error) {
      toast.error('Erro', 'Erro inesperado')
    }
  }

  const openEditModal = (diet: Diet) => {
    setEditingDiet(diet)
    setFormData({
      name: diet.name,
      description: diet.description,
      calories: diet.calories,
      proteins: diet.proteins,
      carbohydrates: diet.carbohydrates,
      fats: diet.fats,
    })
    setModalVisible(true)
  }

  const handleDeleteDiet = async (dietId: number) => {
    Alert.alert('Confirmar', 'Tem certeza que deseja deletar esta dieta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: async () => {
          const success = await deleteDiet(dietId)
          if (success) {
            setFilteredDiets(diets)
          }
        },
      },
    ])
  }

  const openAssignModal = (diet: Diet) => {
    setSelectedDietForAssign(diet)
    setAssignModalVisible(true)
  }

  const handleAssignDiet = async (clientId: string) => {
    if (selectedDietForAssign?.id) {
      const success = await assignDietToClient(
        Number(clientId),
        selectedDietForAssign.id,
      )
      if (success) {
        setAssignModalVisible(false)
        setSelectedDietForAssign(null)
      }
    }
  }

  // ─── Meals handlers ───────────────────────────────────────────────────────
  const openMealsModal = (diet: Diet) => {
    setSelectedDiet(diet)
    setMealsModalVisible(true)
  }

  useEffect(() => {
    fetchDiets()
    fetchClients()
    fetchPersonals()
  }, [fetchDiets, fetchClients, fetchPersonals])

  useEffect(() => {
    setFilteredDiets(diets)
  }, [diets])

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      await Promise.all([fetchDiets(), fetchClients(), fetchPersonals()])
    } finally {
      setRefreshing(false)
    }
  }

  const dietFilterFields: FilterField[] = [
    {
      key: 'name',
      label: 'Nome',
      type: 'text',
      placeholder: 'Filtrar por nome',
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
      key: 'creatorId',
      label: 'Criador',
      type: 'select',
      placeholder: 'Todos os personais',
      value: filters.creatorId,
      options: personals.map((p) => ({ label: p.name, value: String(p.id) })),
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

  const renderDietItem = ({ item }: { item: Diet }) => (
    <DietCard
      diet={item}
      onEdit={openEditModal}
      onDelete={handleDeleteDiet}
      onAssignToClient={openAssignModal}
      onManageMeals={openMealsModal}
    />
  )

  return (
    <View style={styles.container}>
      <PageHeader title="Gerenciar Dietas" buttons={headerButtons} />

      <FlatList
        data={filteredDiets}
        keyExtractor={(item) => item.id.toString()}
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
        onClose={() => { setModalVisible(false); resetForm() }}
        onSave={saveDiet}
        onFormChange={handleFormChange}
      />

      <AssignDietModal
        visible={assignModalVisible}
        diet={selectedDietForAssign}
        clients={clients}
        onClose={() => { setAssignModalVisible(false); setSelectedDietForAssign(null) }}
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

      <MealsManagementModal
        visible={mealsModalVisible}
        diet={selectedDiet}
        onClose={() => setMealsModalVisible(false)}
      />
    </View>
  )
}
