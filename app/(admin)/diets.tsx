import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  FlatList,
  Alert,
  RefreshControl,
  StyleSheet,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { Feather, MaterialIcons } from '@expo/vector-icons'
import { useUsers } from '@/hooks/useUsers'
import { useDiets } from '@/hooks/useDiets'
import { useMeals } from '@/hooks/useMeals'
import { useFoods } from '@/hooks/useFoods'
import { Diet } from '@/interfaces/Diet'
import { Meal } from '@/interfaces/Meal'
import DietFormModal from '@/components/common/DietFormModal'
import MealFormModal from '@/components/common/MealFormModal'
import FoodFormModal from '@/components/common/FoodFormModal'
import AssignDietModal from '@/components/common/AssignDietModal'
import GenericFilterModal, {
  FilterField,
} from '@/components/common/GenericFilterModal'
import PageHeader, { HeaderButton } from '@/components/common/PageHeader'
import DietCard from '@/components/common/DietCard'
import { MealCard } from '@/components/common/MealCard'
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
  const { meals, loading: mealsLoading, fetchMeals, createMeal, updateMeal, deleteMeal } = useMeals()
  const { foods, loading: foodsLoading, fetchFoods, createFood, updateFood, deleteFood } = useFoods()
  const { colors } = useAppTheme()

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    list: { flex: 1, paddingHorizontal: 16, paddingVertical: 8 },
    mealsModal: { flex: 1, backgroundColor: colors.background },
    mealsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.backgroundSecondary,
    },
    mealsHeaderCenter: { alignItems: 'center' },
    mealsHeaderTitle: { fontSize: 17, fontWeight: '600', color: colors.text },
    mealsHeaderSubtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
    mealsHeaderBtn: { paddingHorizontal: 4, paddingVertical: 4, minWidth: 70 },
    mealsHeaderBtnText: { fontSize: 15, color: colors.primary },
    mealsHeaderAddBtn: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      paddingHorizontal: 4, paddingVertical: 4, minWidth: 70, justifyContent: 'flex-end',
    },
    mealsHeaderAddText: { fontSize: 15, color: colors.primary, fontWeight: '600' },
    mealsScroll: { flex: 1, padding: 16 },
    emptyText: {
      textAlign: 'center', color: colors.textSecondary,
      fontSize: 15, marginTop: 40,
    },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    foodsModal: { flex: 1, backgroundColor: colors.background },
    foodItem: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 10, padding: 14, marginBottom: 10,
      borderWidth: 1, borderColor: colors.border,
    },
    foodName: { flex: 1, fontSize: 15, color: colors.text },
    foodActions: { flexDirection: 'row', gap: 8 },
    foodActionBtn: { padding: 6, borderRadius: 6 },
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
  const [mealFormVisible, setMealFormVisible] = useState(false)
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [mealFormData, setMealFormData] = useState<Partial<Meal>>({ name: '', hourly: '', description: '' })

  // Foods management
  const [foodsModalVisible, setFoodsModalVisible] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const [foodFormVisible, setFoodFormVisible] = useState(false)
  const [editingFoodId, setEditingFoodId] = useState<number | null>(null)
  const [foodName, setFoodName] = useState('')

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
      Alert.alert('Erro', 'Erro inesperado')
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
    fetchMeals(diet.id)
  }

  const resetMealForm = () => {
    setMealFormData({ name: '', hourly: '', description: '' })
    setEditingMeal(null)
  }

  const openAddMealForm = () => { resetMealForm(); setMealFormVisible(true) }

  const openEditMealForm = (meal: Meal) => {
    setEditingMeal(meal)
    setMealFormData({ name: meal.name, hourly: meal.hourly, description: meal.description })
    setMealFormVisible(true)
  }

  const saveMeal = async () => {
    if (!selectedDiet) return
    const success = editingMeal
      ? await updateMeal(selectedDiet.id, editingMeal.id, mealFormData)
      : await createMeal(selectedDiet.id, mealFormData)
    if (success) { setMealFormVisible(false); resetMealForm() }
  }

  const handleDeleteMeal = (mealId: number) => {
    if (!selectedDiet) return
    Alert.alert('Confirmar', 'Tem certeza que deseja deletar esta refeição?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Deletar', style: 'destructive', onPress: () => deleteMeal(selectedDiet.id, mealId) },
    ])
  }

  // ─── Foods handlers ───────────────────────────────────────────────────────
  const openFoodsModal = (meal: Meal) => {
    setSelectedMeal(meal)
    setFoodsModalVisible(true)
    fetchFoods(meal.id)
  }

  const openAddFoodForm = () => { setEditingFoodId(null); setFoodName(''); setFoodFormVisible(true) }

  const openEditFoodForm = (foodId: number, currentName: string) => {
    setEditingFoodId(foodId); setFoodName(currentName); setFoodFormVisible(true)
  }

  const saveFood = async () => {
    if (!selectedMeal) return
    const success = editingFoodId !== null
      ? await updateFood(selectedMeal.id, editingFoodId, { name: foodName })
      : await createFood(selectedMeal.id, { name: foodName })
    if (success) { setFoodFormVisible(false); setEditingFoodId(null); setFoodName('') }
  }

  const handleDeleteFood = (foodId: number) => {
    if (!selectedMeal) return
    Alert.alert('Confirmar', 'Tem certeza que deseja deletar este alimento?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Deletar', style: 'destructive', onPress: () => deleteFood(selectedMeal.id, foodId) },
    ])
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

      {/* ── Meals management modal ── */}
      <Modal
        visible={mealsModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setMealsModalVisible(false)}
      >
        <SafeAreaView style={styles.mealsModal}>
          <View style={styles.mealsHeader}>
            <TouchableOpacity style={styles.mealsHeaderBtn} onPress={() => setMealsModalVisible(false)}>
              <Text style={styles.mealsHeaderBtnText}>Fechar</Text>
            </TouchableOpacity>
            <View style={styles.mealsHeaderCenter}>
              <Text style={styles.mealsHeaderTitle} numberOfLines={1}>{selectedDiet?.name ?? 'Refeições'}</Text>
              <Text style={styles.mealsHeaderSubtitle}>{meals.length} {meals.length === 1 ? 'refeição' : 'refeições'}</Text>
            </View>
            <TouchableOpacity style={styles.mealsHeaderAddBtn} onPress={openAddMealForm}>
              <Feather name="plus" size={16} color={colors.primary} />
              <Text style={styles.mealsHeaderAddText}>Adicionar</Text>
            </TouchableOpacity>
          </View>

          {mealsLoading ? (
            <View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.primary} /></View>
          ) : (
            <ScrollView style={styles.mealsScroll} showsVerticalScrollIndicator={false}>
              {meals.length === 0 ? (
                <Text style={styles.emptyText}>Nenhuma refeição cadastrada.</Text>
              ) : (
                meals.map((meal) => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    foods={meal.foods}
                    onEdit={openEditMealForm}
                    onDelete={handleDeleteMeal}
                    onManageFoods={openFoodsModal}
                  />
                ))
              )}
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

      <MealFormModal
        visible={mealFormVisible}
        title={editingMeal ? 'Editar Refeição' : 'Nova Refeição'}
        formData={mealFormData}
        onClose={() => { setMealFormVisible(false); resetMealForm() }}
        onSave={saveMeal}
        onFormChange={(key, value) => setMealFormData({ ...mealFormData, [key]: value })}
      />

      {/* ── Foods management modal ── */}
      <Modal
        visible={foodsModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setFoodsModalVisible(false)}
      >
        <SafeAreaView style={styles.foodsModal}>
          <View style={styles.mealsHeader}>
            <TouchableOpacity style={styles.mealsHeaderBtn} onPress={() => setFoodsModalVisible(false)}>
              <Text style={styles.mealsHeaderBtnText}>Fechar</Text>
            </TouchableOpacity>
            <View style={styles.mealsHeaderCenter}>
              <Text style={styles.mealsHeaderTitle} numberOfLines={1}>{selectedMeal?.name ?? 'Alimentos'}</Text>
              <Text style={styles.mealsHeaderSubtitle}>{foods.length} {foods.length === 1 ? 'alimento' : 'alimentos'}</Text>
            </View>
            <TouchableOpacity style={styles.mealsHeaderAddBtn} onPress={openAddFoodForm}>
              <Feather name="plus" size={16} color={colors.primary} />
              <Text style={styles.mealsHeaderAddText}>Adicionar</Text>
            </TouchableOpacity>
          </View>

          {foodsLoading ? (
            <View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.primary} /></View>
          ) : (
            <ScrollView style={styles.mealsScroll} showsVerticalScrollIndicator={false}>
              {foods.length === 0 ? (
                <Text style={styles.emptyText}>Nenhum alimento cadastrado.</Text>
              ) : (
                foods.map((food) => (
                  <View key={food.id} style={styles.foodItem}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <View style={styles.foodActions}>
                      <TouchableOpacity
                        style={[styles.foodActionBtn, { backgroundColor: colors.primaryButtonLight }]}
                        onPress={() => openEditFoodForm(food.id, food.name)}
                      >
                        <MaterialIcons name="edit" size={16} color={colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.foodActionBtn, { backgroundColor: colors.dangerLight }]}
                        onPress={() => handleDeleteFood(food.id)}
                      >
                        <MaterialIcons name="delete" size={16} color={colors.danger} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

      <FoodFormModal
        visible={foodFormVisible}
        title={editingFoodId !== null ? 'Editar Alimento' : 'Novo Alimento'}
        name={foodName}
        onClose={() => { setFoodFormVisible(false); setFoodName(''); setEditingFoodId(null) }}
        onSave={saveFood}
        onNameChange={setFoodName}
      />
    </View>
  )
}
