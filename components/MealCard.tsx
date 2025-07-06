import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

import { IMeal } from '@/interfaces/Diet'

interface MealCardProps {
  meal: IMeal
}

export function MealCard({ meal }: MealCardProps) {
  return (
    <View style={styles.mealCard}>
      <View style={styles.mealHeader}>
        <Text style={styles.mealName}>{meal.nome}</Text>
        {meal.horario && (
          <View style={styles.timeContainer}>
            <MaterialIcons name="schedule" size={16} color="#666" />
            <Text style={styles.mealTime}>{meal.horario}</Text>
          </View>
        )}
      </View>

      {meal.descricao && (
        <Text style={styles.mealDescription}>{meal.descricao}</Text>
      )}

      <View style={styles.foodsContainer}>
        <Text style={styles.foodsTitle}>Alimentos:</Text>
        {meal.alimentos.map((alimento, index) => (
          <View key={index} style={styles.foodItem}>
            <MaterialIcons
              name="fiber-manual-record"
              size={8}
              color="#0a84ff"
            />
            <Text style={styles.foodText}>{alimento}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mealCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mealTime: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  mealDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  foodsContainer: {
    marginTop: 12,
  },
  foodsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  foodText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
})
