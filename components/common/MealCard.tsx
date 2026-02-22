import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

import { useAppTheme } from '@/hooks/useAppTheme'
import { Meal } from '@/interfaces/Meal'
import { Food } from '@/interfaces/Food'

interface MealCardProps {
  meal: Meal
  foods?: Food[]
  onEdit?: (meal: Meal) => void
  onDelete?: (mealId: number) => void
  onManageFoods?: (meal: Meal) => void
}

export const MealCard = React.memo(function MealCard({
  meal,
  foods = [],
  onEdit,
  onDelete,
  onManageFoods,
}: MealCardProps) {
  const { colors } = useAppTheme()

  return (
    <View
      style={[
        styles.mealCard,
        {
          backgroundColor: colors.backgroundSecondary,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.mealHeader}>
        <Text style={[styles.mealName, { color: colors.text }]}>
          {meal.name}
        </Text>
        {meal.hourly && (
          <View style={styles.timeContainer}>
            <MaterialIcons
              name="schedule"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={[styles.mealTime, { color: colors.textSecondary }]}>
              {meal.hourly}
            </Text>
          </View>
        )}
      </View>

      {meal.description && (
        <Text style={[styles.mealDescription, { color: colors.textSecondary }]}>
          {meal.description}
        </Text>
      )}

      {foods.length > 0 && (
        <View style={styles.foodsContainer}>
          <Text style={[styles.foodsTitle, { color: colors.text }]}>
            Alimentos:
          </Text>
          {foods.map((food) => (
            <View key={food.id} style={styles.foodItem}>
              <MaterialIcons
                name="fiber-manual-record"
                size={8}
                color={colors.primary}
              />
              <Text style={[styles.foodText, { color: colors.textSecondary }]}>
                {food.name}
              </Text>
            </View>
          ))}
        </View>
      )}

      {(onEdit || onDelete || onManageFoods) && (
        <View
          style={[
            styles.actions,
            { borderTopColor: colors.border },
          ]}
        >
          {onManageFoods && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.primaryLight },
              ]}
              onPress={() => onManageFoods(meal)}
            >
              <MaterialIcons name="restaurant" size={14} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.primary }]}>
                Alimentos
              </Text>
            </TouchableOpacity>
          )}
          {onEdit && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.primaryButtonLight },
              ]}
              onPress={() => onEdit(meal)}
            >
              <MaterialIcons name="edit" size={14} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.primary }]}>
                Editar
              </Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.dangerLight },
              ]}
              onPress={() => onDelete(meal.id)}
            >
              <MaterialIcons name="delete" size={14} color={colors.danger} />
              <Text style={[styles.actionText, { color: colors.danger }]}>
                Excluir
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  mealCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
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
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mealTime: {
    fontSize: 14,
    fontWeight: '500',
  },
  mealDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  foodsContainer: {
    marginTop: 12,
  },
  foodsTitle: {
    fontSize: 16,
    fontWeight: '600',
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
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
  },
})
