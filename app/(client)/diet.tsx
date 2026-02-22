import { useCallback, useState } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native'
import { useFocusEffect } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'

import { useDiets } from '@/hooks/useDiets'
import { useAppTheme } from '@/hooks/useAppTheme'
import { useAuth } from '@/context/authContext'
import { Diet } from '@/interfaces/Diet'
import { Meal } from '@/interfaces/Meal'
import { MealCard } from '@/components/common/MealCard'

export default function DietScreen() {
  const { getUser } = useAuth()
  const { fetchDietById, fetchUserDiet, loading: dietLoading } = useDiets()
  const { colors } = useAppTheme()
  const [diet, setDiet] = useState<Diet | null>(null)
  const [meals, setMeals] = useState<Meal[]>([])
  const [error, setError] = useState<string | null>(null)

  const loadDiet = useCallback(async () => {
    try {
      setError(null)
      const user = await getUser()
      if (!user?.id) {
        setDiet(null)
        return
      }

      let result: Diet | null = null

      if (user.dietId) {
        // GET /diets/{id} retorna meals embutidas
        result = await fetchDietById(user.dietId)
      }

      // Fallback: busca a lista e depois o detalhe completo
      if (!result) {
        result = await fetchUserDiet(user.id)
      }

      if (result) {
        setDiet(result)
        setMeals(result.meals ?? [])
      } else {
        setDiet(null)
        setMeals([])
      }
    } catch (err) {
      console.error('Erro ao carregar dieta:', err)
      setError('Erro ao carregar dieta')
    }
  }, [getUser, fetchDietById, fetchUserDiet])

  useFocusEffect(
    useCallback(() => {
      loadDiet()
    }, [loadDiet]),
  )

  const loading = dietLoading

  if (loading && !diet) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Carregando sua dieta...
        </Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <MaterialIcons name="restaurant" size={48} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        <TouchableOpacity
          onPress={loadDiet}
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!diet) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <MaterialIcons name="no-meals" size={48} color={colors.textSecondary} />
        <Text style={[styles.emptyText, { color: colors.text }]}>
          Nenhuma dieta encontrada
        </Text>
        <Text style={[styles.emptySubText, { color: colors.textSecondary }]}>
          Consulte um profissional para criar sua dieta personalizada!
        </Text>
      </View>
    )
  }

  const renderMeal = ({ item }: { item: Meal }) => (
    <MealCard meal={item} foods={item.foods} />
  )

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View
        style={[styles.header, { backgroundColor: colors.backgroundSecondary }]}
      >
        <Text style={[styles.title, { color: colors.text }]}>{diet.name}</Text>
        {diet.description && (
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {diet.description}
          </Text>
        )}
      </View>

      {(diet.calories || diet.proteins || diet.carbohydrates || diet.fats) && (
        <View
          style={[
            styles.macrosContainer,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          <Text style={[styles.macrosTitle, { color: colors.text }]}>
            Informacoes Nutricionais
          </Text>
          <View style={styles.macrosGrid}>
            {!!diet.calories && (
              <View style={styles.macroItem}>
                <MaterialIcons
                  name="local-fire-department"
                  size={24}
                  color="#ff6b35"
                />
                <Text style={[styles.macroValue, { color: colors.text }]}>
                  {diet.calories}
                </Text>
                <Text
                  style={[styles.macroLabel, { color: colors.textSecondary }]}
                >
                  Calorias
                </Text>
              </View>
            )}
            {!!diet.proteins && (
              <View style={styles.macroItem}>
                <MaterialIcons
                  name="fitness-center"
                  size={24}
                  color="#28a745"
                />
                <Text style={[styles.macroValue, { color: colors.text }]}>
                  {diet.proteins}g
                </Text>
                <Text
                  style={[styles.macroLabel, { color: colors.textSecondary }]}
                >
                  Proteinas
                </Text>
              </View>
            )}
            {!!diet.carbohydrates && (
              <View style={styles.macroItem}>
                <MaterialIcons name="grain" size={24} color="#ffc107" />
                <Text style={[styles.macroValue, { color: colors.text }]}>
                  {diet.carbohydrates}g
                </Text>
                <Text
                  style={[styles.macroLabel, { color: colors.textSecondary }]}
                >
                  Carboidratos
                </Text>
              </View>
            )}
            {!!diet.fats && (
              <View style={styles.macroItem}>
                <MaterialIcons name="opacity" size={24} color="#17a2b8" />
                <Text style={[styles.macroValue, { color: colors.text }]}>
                  {diet.fats}g
                </Text>
                <Text
                  style={[styles.macroLabel, { color: colors.textSecondary }]}
                >
                  Gorduras
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      <View style={styles.mealsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Suas Refeicoes
        </Text>
        {meals.length === 0 ? (
          <Text style={[styles.emptySubText, { color: colors.textSecondary }]}>
            Nenhuma refeicao cadastrada nesta dieta.
          </Text>
        ) : (
          <FlatList
            data={meals}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMeal}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: { marginTop: 12, fontSize: 16 },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 12,
  },
  retryButton: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  retryText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubText: { fontSize: 14, marginTop: 8, textAlign: 'center' },
  header: {
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  description: { fontSize: 16, lineHeight: 22, marginBottom: 8 },
  macrosContainer: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  macrosTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  macrosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  macroItem: { alignItems: 'center', width: '48%', marginBottom: 16 },
  macroValue: { fontSize: 20, fontWeight: 'bold', marginTop: 8 },
  macroLabel: { fontSize: 12, marginTop: 4 },
  mealsSection: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
})
