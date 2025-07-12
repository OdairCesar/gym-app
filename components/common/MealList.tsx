import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { IMeal } from '@/interfaces/Diet'
import { useAppTheme } from '@/hooks/useAppTheme'

interface MealListProps {
  meals: IMeal[]
  onAdd: () => void
  onRemove: (index: number) => void
}

export default function MealList({ meals, onAdd, onRemove }: MealListProps) {
  const { colors } = useAppTheme()

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    addButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.textLight,
      marginLeft: 4,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    emptyText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.textSecondary,
      marginTop: 16,
      textAlign: 'center',
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: 'center',
      opacity: 0.7,
    },
    list: {
      flex: 1,
    },
    mealItem: {
      backgroundColor: colors.backgroundSecondary,
      marginVertical: 4,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    mealContent: {
      padding: 16,
    },
    mealHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    mealName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
    },
    timeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    mealTime: {
      fontSize: 12,
      color: colors.primary,
      marginLeft: 4,
      fontWeight: '500',
    },
    mealDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 8,
    },
    removeButton: {
      position: 'absolute',
      bottom: 8,
      right: 8,
      backgroundColor: colors.dangerLight,
      borderRadius: 16,
      padding: 4,
    },
    foodsContainer: {
      marginTop: 8,
    },
    foodsTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 4,
    },
    foodsList: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },
  })

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
          <MaterialIcons name="add" size={20} color={colors.textLight} />
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
