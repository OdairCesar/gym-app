import React, { useState, useEffect } from 'react'
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native'
import { Feather, MaterialIcons } from '@expo/vector-icons'
import { Diet } from '@/interfaces/Diet'
import { Meal } from '@/interfaces/Meal'
import { useMeals } from '@/hooks/useMeals'
import { useFoods } from '@/hooks/useFoods'
import { MealCard } from '@/components/common/MealCard'
import MealFormModal from '@/components/common/MealFormModal'
import FoodFormModal from '@/components/common/FoodFormModal'
import { useAppTheme } from '@/hooks/useAppTheme'

interface MealsManagementModalProps {
  visible: boolean
  diet: Diet | null
  onClose: () => void
}

export default function MealsManagementModal({
  visible,
  diet,
  onClose,
}: MealsManagementModalProps) {
  const { colors } = useAppTheme()
  const {
    meals,
    loading: mealsLoading,
    fetchMeals,
    createMeal,
    updateMeal,
    deleteMeal,
  } = useMeals()
  const {
    foods,
    loading: foodsLoading,
    fetchFoods,
    createFood,
    updateFood,
    deleteFood,
  } = useFoods()

  // ─── Meals state ────────────────────────────────────────────────────────────
  const [mealFormVisible, setMealFormVisible] = useState(false)
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [mealFormData, setMealFormData] = useState<Partial<Meal>>({
    name: '',
    hourly: '',
    description: '',
  })

  // ─── Foods state ────────────────────────────────────────────────────────────
  const [foodsModalVisible, setFoodsModalVisible] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const [foodFormVisible, setFoodFormVisible] = useState(false)
  const [editingFoodId, setEditingFoodId] = useState<number | null>(null)
  const [foodName, setFoodName] = useState('')

  useEffect(() => {
    if (visible && diet) {
      fetchMeals(diet.id)
    }
  }, [visible, diet])

  const styles = StyleSheet.create({
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
    mealsHeaderSubtitle: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    mealsHeaderBtn: {
      paddingHorizontal: 4,
      paddingVertical: 4,
      minWidth: 70,
    },
    mealsHeaderBtnText: { fontSize: 15, color: colors.primary },
    mealsHeaderAddBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 4,
      paddingVertical: 4,
      minWidth: 70,
      justifyContent: 'flex-end',
    },
    mealsHeaderAddText: {
      fontSize: 15,
      color: colors.primary,
      fontWeight: '600',
    },
    mealsScroll: { flex: 1, padding: 16 },
    emptyText: {
      textAlign: 'center',
      color: colors.textSecondary,
      fontSize: 15,
      marginTop: 40,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    foodsModal: { flex: 1, backgroundColor: colors.background },
    foodItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 10,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    foodName: { flex: 1, fontSize: 15, color: colors.text },
    foodActions: { flexDirection: 'row', gap: 8 },
    foodActionBtn: { padding: 6, borderRadius: 6 },
  })

  // ─── Meals handlers ──────────────────────────────────────────────────────────
  const resetMealForm = () => {
    setMealFormData({ name: '', hourly: '', description: '' })
    setEditingMeal(null)
  }

  const openAddMealForm = () => {
    resetMealForm()
    setMealFormVisible(true)
  }

  const openEditMealForm = (meal: Meal) => {
    setEditingMeal(meal)
    setMealFormData({
      name: meal.name,
      hourly: meal.hourly,
      description: meal.description,
    })
    setMealFormVisible(true)
  }

  const saveMeal = async () => {
    if (!diet) return
    const success = editingMeal
      ? await updateMeal(diet.id, editingMeal.id, mealFormData)
      : await createMeal(diet.id, mealFormData)
    if (success) {
      setMealFormVisible(false)
      resetMealForm()
    }
  }

  const handleDeleteMeal = (mealId: number) => {
    if (!diet) return
    Alert.alert('Confirmar', 'Tem certeza que deseja deletar esta refeição?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: () => deleteMeal(diet.id, mealId),
      },
    ])
  }

  // ─── Foods handlers ──────────────────────────────────────────────────────────
  const openFoodsModal = (meal: Meal) => {
    setSelectedMeal(meal)
    setFoodsModalVisible(true)
    fetchFoods(meal.id)
  }

  const openAddFoodForm = () => {
    setEditingFoodId(null)
    setFoodName('')
    setFoodFormVisible(true)
  }

  const openEditFoodForm = (foodId: number, currentName: string) => {
    setEditingFoodId(foodId)
    setFoodName(currentName)
    setFoodFormVisible(true)
  }

  const saveFood = async () => {
    if (!selectedMeal) return
    const success =
      editingFoodId !== null
        ? await updateFood(selectedMeal.id, editingFoodId, { name: foodName })
        : await createFood(selectedMeal.id, { name: foodName })
    if (success) {
      setFoodFormVisible(false)
      setEditingFoodId(null)
      setFoodName('')
    }
  }

  const handleDeleteFood = (foodId: number) => {
    if (!selectedMeal) return
    Alert.alert('Confirmar', 'Tem certeza que deseja deletar este alimento?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: () => deleteFood(selectedMeal.id, foodId),
      },
    ])
  }

  return (
    <>
      {/* ── Meals management modal ── */}
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <SafeAreaView style={styles.mealsModal}>
          <View style={styles.mealsHeader}>
            <TouchableOpacity style={styles.mealsHeaderBtn} onPress={onClose}>
              <Text style={styles.mealsHeaderBtnText}>Fechar</Text>
            </TouchableOpacity>
            <View style={styles.mealsHeaderCenter}>
              <Text style={styles.mealsHeaderTitle} numberOfLines={1}>
                {diet?.name ?? 'Refeições'}
              </Text>
              <Text style={styles.mealsHeaderSubtitle}>
                {meals.length}{' '}
                {meals.length === 1 ? 'refeição' : 'refeições'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.mealsHeaderAddBtn}
              onPress={openAddMealForm}
            >
              <Feather name="plus" size={16} color={colors.primary} />
              <Text style={styles.mealsHeaderAddText}>Adicionar</Text>
            </TouchableOpacity>
          </View>

          {mealsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <ScrollView
              style={styles.mealsScroll}
              showsVerticalScrollIndicator={false}
            >
              {meals.length === 0 ? (
                <Text style={styles.emptyText}>
                  Nenhuma refeição cadastrada.
                </Text>
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
        onClose={() => {
          setMealFormVisible(false)
          resetMealForm()
        }}
        onSave={saveMeal}
        onFormChange={(key, value) =>
          setMealFormData({ ...mealFormData, [key]: value })
        }
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
            <TouchableOpacity
              style={styles.mealsHeaderBtn}
              onPress={() => setFoodsModalVisible(false)}
            >
              <Text style={styles.mealsHeaderBtnText}>Fechar</Text>
            </TouchableOpacity>
            <View style={styles.mealsHeaderCenter}>
              <Text style={styles.mealsHeaderTitle} numberOfLines={1}>
                {selectedMeal?.name ?? 'Alimentos'}
              </Text>
              <Text style={styles.mealsHeaderSubtitle}>
                {foods.length} {foods.length === 1 ? 'alimento' : 'alimentos'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.mealsHeaderAddBtn}
              onPress={openAddFoodForm}
            >
              <Feather name="plus" size={16} color={colors.primary} />
              <Text style={styles.mealsHeaderAddText}>Adicionar</Text>
            </TouchableOpacity>
          </View>

          {foodsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <ScrollView
              style={styles.mealsScroll}
              showsVerticalScrollIndicator={false}
            >
              {foods.length === 0 ? (
                <Text style={styles.emptyText}>
                  Nenhum alimento cadastrado.
                </Text>
              ) : (
                foods.map((food) => (
                  <View key={food.id} style={styles.foodItem}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <View style={styles.foodActions}>
                      <TouchableOpacity
                        style={[
                          styles.foodActionBtn,
                          { backgroundColor: colors.primaryButtonLight },
                        ]}
                        onPress={() => openEditFoodForm(food.id, food.name)}
                      >
                        <MaterialIcons
                          name="edit"
                          size={16}
                          color={colors.primary}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.foodActionBtn,
                          { backgroundColor: colors.dangerLight },
                        ]}
                        onPress={() => handleDeleteFood(food.id)}
                      >
                        <MaterialIcons
                          name="delete"
                          size={16}
                          color={colors.danger}
                        />
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
        onClose={() => {
          setFoodFormVisible(false)
          setFoodName('')
          setEditingFoodId(null)
        }}
        onSave={saveFood}
        onNameChange={setFoodName}
      />
    </>
  )
}
