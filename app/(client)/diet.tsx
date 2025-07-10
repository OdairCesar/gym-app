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
import { IDiet, IMeal } from '@/interfaces/Diet'
import { MealCard } from '@/components/MealCard'

export default function DietScreen() {
  const { fetchUserDiet, loading } = useDiets()
  const [diet, setDiet] = useState<IDiet | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadUserDiet = useCallback(async () => {
    try {
      setError(null)
      const result = await fetchUserDiet()
      setDiet(result)
    } catch (err) {
      console.error('Erro ao carregar dieta:', err)
      setError('Erro ao carregar dieta')
    }
  }, [fetchUserDiet])

  useFocusEffect(
    useCallback(() => {
      loadUserDiet()
    }, [loadUserDiet]),
  )

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0a84ff" />
        <Text style={styles.loadingText}>Carregando sua dieta...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <MaterialIcons name="restaurant" size={48} color="#d9534f" />
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <TouchableOpacity onPress={loadUserDiet} style={styles.retryButton}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!diet) {
    return (
      <View style={styles.centered}>
        <MaterialIcons name="no-meals" size={48} color="#999" />
        <Text style={styles.emptyText}>Nenhuma dieta encontrada</Text>
        <Text style={styles.emptySubText}>
          Consulte um nutricionista para criar sua dieta personalizada!
        </Text>
      </View>
    )
  }

  const renderMeal = ({ item }: { item: IMeal }) => <MealCard meal={item} />

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{diet.nome}</Text>
        {diet.descricao && (
          <Text style={styles.description}>{diet.descricao}</Text>
        )}
        {diet.criador && (
          <Text style={styles.nutritionist}>Criada por: {diet.criador}</Text>
        )}
      </View>

      {(diet.calorias ||
        diet.proteinas ||
        diet.carboidratos ||
        diet.gorduras) && (
        <View style={styles.macrosContainer}>
          <Text style={styles.macrosTitle}>Informações Nutricionais</Text>
          <View style={styles.macrosGrid}>
            {diet.calorias && (
              <View style={styles.macroItem}>
                <MaterialIcons
                  name="local-fire-department"
                  size={24}
                  color="#ff6b35"
                />
                <Text style={styles.macroValue}>{diet.calorias}</Text>
                <Text style={styles.macroLabel}>Calorias</Text>
              </View>
            )}
            {diet.proteinas && (
              <View style={styles.macroItem}>
                <MaterialIcons
                  name="fitness-center"
                  size={24}
                  color="#28a745"
                />
                <Text style={styles.macroValue}>{diet.proteinas}g</Text>
                <Text style={styles.macroLabel}>Proteínas</Text>
              </View>
            )}
            {diet.carboidratos && (
              <View style={styles.macroItem}>
                <MaterialIcons name="grain" size={24} color="#ffc107" />
                <Text style={styles.macroValue}>{diet.carboidratos}g</Text>
                <Text style={styles.macroLabel}>Carboidratos</Text>
              </View>
            )}
            {diet.gorduras && (
              <View style={styles.macroItem}>
                <MaterialIcons name="opacity" size={24} color="#17a2b8" />
                <Text style={styles.macroValue}>{diet.gorduras}g</Text>
                <Text style={styles.macroLabel}>Gorduras</Text>
              </View>
            )}
          </View>
        </View>
      )}

      <View style={styles.mealsSection}>
        <Text style={styles.sectionTitle}>Suas Refeições</Text>
        <FlatList
          data={diet.refeicoes}
          keyExtractor={(item, index) => `${item.nome}-${index}`}
          renderItem={renderMeal}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: '#d9534f',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 12,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#0a84ff',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 8,
  },
  nutritionist: {
    fontSize: 14,
    color: '#0a84ff',
    fontWeight: '500',
  },
  macrosContainer: {
    backgroundColor: '#fff',
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
  macrosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  macrosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
  },
  macroValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  macroLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  mealsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
})
