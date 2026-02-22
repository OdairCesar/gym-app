import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Diet } from '@/interfaces/Diet'
import { useAppTheme } from '@/hooks/useAppTheme'

interface DietCardProps {
  diet: Diet
  onEdit: (diet: Diet) => void
  onDelete: (dietId: number) => void
  onAssignToClient: (diet: Diet) => void
  onManageMeals?: (diet: Diet) => void
}

function DietCard({
  diet,
  onEdit,
  onDelete,
  onAssignToClient,
  onManageMeals,
}: DietCardProps) {
  const { colors } = useAppTheme()

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      marginVertical: 4,
      padding: 16,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
    },
    mealsCount: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    mealsCountText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.primary,
      marginLeft: 4,
    },
    mealsButton: {
      backgroundColor: colors.primaryLight,
    },
    mealsButtonText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.primary,
      marginLeft: 4,
    },
    description: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 12,
      lineHeight: 20,
    },
    nutritionInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 12,
    },
    nutritionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
      marginBottom: 4,
    },
    nutritionLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginRight: 4,
    },
    nutritionValue: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.success,
    },
    details: {
      marginBottom: 12,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    detailLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    detailValue: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      marginLeft: 8,
    },
    assignButton: {
      backgroundColor: colors.successLight,
    },
    editButton: {
      backgroundColor: colors.primaryButtonLight,
    },
    deleteButton: {
      backgroundColor: colors.dangerLight,
    },
    editButtonText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.primary,
      marginLeft: 4,
    },
    deleteButtonText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.danger,
      marginLeft: 4,
    },
    assignButtonText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.success,
      marginLeft: 4,
    },
  })

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{diet.name}</Text>
        <View style={styles.mealsCount}>
          <MaterialIcons
            name="restaurant-menu"
            size={16}
            color={colors.primary}
          />
        </View>
      </View>

      {diet.description && (
        <Text style={styles.description} numberOfLines={2}>
          {diet.description}
        </Text>
      )}

      <View style={styles.nutritionInfo}>
        {diet.calories && (
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Calorias:</Text>
            <Text style={styles.nutritionValue}>{diet.calories} kcal</Text>
          </View>
        )}
        {diet.proteins && (
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Proteínas:</Text>
            <Text style={styles.nutritionValue}>{diet.proteins}g</Text>
          </View>
        )}
        {diet.carbohydrates && (
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Carboidratos:</Text>
            <Text style={styles.nutritionValue}>{diet.carbohydrates}g</Text>
          </View>
        )}
        {diet.fats && (
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Gorduras:</Text>
            <Text style={styles.nutritionValue}>{diet.fats}g</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {onManageMeals && (
          <TouchableOpacity
            style={[styles.actionButton, styles.mealsButton]}
            onPress={() => onManageMeals(diet)}
          >
            <MaterialIcons name="restaurant-menu" size={16} color={colors.primary} />
            <Text style={styles.mealsButtonText}>Refeições</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.actionButton, styles.assignButton]}
          onPress={() => onAssignToClient(diet)}
        >
          <MaterialIcons name="person-add" size={16} color={colors.success} />
          <Text style={styles.assignButtonText}>Atribuir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEdit(diet)}
        >
          <MaterialIcons name="edit" size={16} color={colors.primary} />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete(diet.id)}
        >
          <MaterialIcons name="delete" size={16} color={colors.danger} />
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default React.memo(DietCard)
