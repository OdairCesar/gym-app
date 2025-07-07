import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { IMeal } from '@/interfaces/Diet'

interface MealListProps {
  meals: IMeal[]
  onAdd: () => void
  onRemove: (index: number) => void
}

export default function MealList({ meals, onAdd, onRemove }: MealListProps) {
  const renderMealItem = ({ item, index }: { item: IMeal; index: number }) => (
    <View style={styles.mealItem}>
      <View style={styles.mealContent}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealName}>{item.nome}</Text>
          {item.horario && (
            <View style={styles.timeContainer}>
              <MaterialIcons name="schedule" size={14} color="#666" />
              <Text style={styles.mealTime}>{item.horario}</Text>
            </View>
          )}
        </View>

        {item.descricao && (
          <Text style={styles.mealDescription} numberOfLines={2}>
            {item.descricao}
          </Text>
        )}

        <View style={styles.foodsContainer}>
          <Text style={styles.foodsTitle}>
            Alimentos ({item.alimentos.length}):
          </Text>
          <Text style={styles.foodsList} numberOfLines={2}>
            {item.alimentos.join(', ')}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onRemove(index)}
      >
        <MaterialIcons name="delete" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Refeições ({meals.length})</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
          <MaterialIcons name="add" size={20} color="#007AFF" />
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      {meals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="restaurant-menu" size={40} color="#C7C7CC" />
          <Text style={styles.emptyText}>Nenhuma refeição adicionada</Text>
          <Text style={styles.emptySubtext}>
            Toque em Adicionar para criar a primeira refeição
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {meals.map((item, index) => (
            <View key={`meal-${index}-${item.nome}`}>
              {renderMealItem({ item, index })}
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#C7C7CC',
    textAlign: 'center',
    marginTop: 4,
  },
  list: {
    // Removido maxHeight para permitir scroll completo
  },
  mealItem: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  mealContent: {
    flex: 1,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mealName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealTime: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  mealDescription: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 6,
    lineHeight: 16,
  },
  foodsContainer: {
    marginTop: 4,
  },
  foodsTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#007AFF',
    marginBottom: 2,
  },
  foodsList: {
    fontSize: 12,
    color: '#333',
    lineHeight: 16,
  },
  removeButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
